"""
Views for Training and TrainingCategory management.
"""
from django.db import models
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from drf_spectacular.utils import extend_schema, OpenApiParameter

from apps.core.exceptions import api_response
from apps.core.permissions import IsAdminOrReadOnly
from .models import TrainingCategory, Training
from .serializers import (
    TrainingCategorySerializer,
    TrainingCategoryCreateUpdateSerializer,
    TrainingListSerializer,
    TrainingSerializer,
    TrainingCreateUpdateSerializer,
)


class TrainingCategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for TrainingCategory CRUD operations.
    """
    queryset = TrainingCategory.objects.all()
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return TrainingCategoryCreateUpdateSerializer
        return TrainingCategorySerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Exclude soft-deleted categories
        queryset = queryset.filter(is_deleted=False)
        
        # Admin sees all categories
        if self.request.user.is_authenticated and hasattr(self.request.user, 'is_admin') and self.request.user.is_admin:
            return queryset
        
        # Public sees only active categories
        return queryset.filter(is_active=True)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return api_response(
            success=True,
            message="Liste des catégories récupérée avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(
            success=True,
            message="Catégorie récupérée avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return api_response(
                success=True,
                message="Catégorie créée avec succès.",
                data=TrainingCategorySerializer(serializer.instance).data,
                status_code=status.HTTP_201_CREATED
            )
        return api_response(
            success=False,
            message="Erreur lors de la création de la catégorie.",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=kwargs.get('partial', False))
        if serializer.is_valid():
            serializer.save()
            return api_response(
                success=True,
                message="Catégorie mise à jour avec succès.",
                data=TrainingCategorySerializer(serializer.instance).data,
                status_code=status.HTTP_200_OK
            )
        return api_response(
            success=False,
            message="Erreur lors de la mise à jour de la catégorie.",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Check if category has trainings
        trainings_count = instance.trainings.filter(is_deleted=False).count()
        if trainings_count > 0:
            return api_response(
                success=False,
                message=f"Impossible de supprimer cette catégorie. Elle contient {trainings_count} formation(s).",
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        # Soft delete
        instance.is_deleted = True
        instance.deleted_at = timezone.now()
        instance.save()
        
        return api_response(
            success=True,
            message="Catégorie supprimée avec succès.",
            status_code=status.HTTP_200_OK
        )


class TrainingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Training CRUD operations with publish/archive actions.
    """
    queryset = Training.objects.select_related('category', 'instructor', 'created_by').all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'level', 'training_mode', 'status', 'is_featured', 'certification']
    search_fields = ['title', 'short_description', 'description', 'target_audience']
    ordering_fields = ['created_at', 'start_date', 'price', 'views_count', 'title']
    ordering = ['-created_at']
    lookup_field = 'slug'

    def get_permissions(self):
        """
        Return appropriate permissions based on action.
        """
        if self.action in ['list', 'retrieve', 'featured']:
            return [AllowAny()]
        elif self.action in ['create', 'update', 'partial_update', 'archive', 'duplicate']:
            return [IsAuthenticated()]
        elif self.action in ['publish', 'draft', 'destroy']:
            return [IsAdminOrReadOnly()]
        return [IsAdminOrReadOnly()]

    def get_serializer_class(self):
        if self.action == 'list':
            return TrainingListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return TrainingCreateUpdateSerializer
        return TrainingSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Exclude soft-deleted trainings
        queryset = queryset.filter(is_deleted=False)
        
        # Admin and Super Admin see all trainings
        if self.request.user.is_authenticated and hasattr(self.request.user, 'role'):
            if self.request.user.role in ['SUPER_ADMIN', 'ADMIN']:
                return queryset
            
            # Editors see their own trainings and published trainings
            elif self.request.user.role == 'EDITOR':
                return queryset.filter(
                    models.Q(created_by=self.request.user) | 
                    models.Q(status='PUBLISHED')
                )
        
        # Public sees only published trainings
        return queryset.filter(status='PUBLISHED')

    @extend_schema(
        summary="Liste des formations",
        parameters=[
            OpenApiParameter('category', int, description='Filtrer par catégorie'),
            OpenApiParameter('level', str, description='Filtrer par niveau (BEGINNER, INTERMEDIATE, ADVANCED)'),
            OpenApiParameter('training_mode', str, description='Filtrer par mode (ONLINE, ONSITE, HYBRID)'),
            OpenApiParameter('search', str, description='Recherche par titre ou description'),
        ]
    )
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        
        return api_response(
            success=True,
            message="Liste des formations récupérée avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Increment views count
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        
        serializer = self.get_serializer(instance)
        return api_response(
            success=True,
            message="Formation récupérée avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Editors must create trainings in DRAFT status
            status_value = serializer.validated_data.get('status', 'DRAFT')
            if hasattr(request.user, 'role') and request.user.role == 'EDITOR':
                status_value = 'DRAFT'
            
            instance = serializer.save(created_by=request.user, status=status_value)
            
            return api_response(
                success=True,
                message="Formation créée avec succès.",
                data=TrainingSerializer(instance).data,
                status_code=status.HTTP_201_CREATED
            )
        return api_response(
            success=False,
            message="Erreur lors de la création de la formation.",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return api_response(
                success=True,
                message="Formation mise à jour avec succès.",
                data=TrainingSerializer(serializer.instance).data,
                status_code=status.HTTP_200_OK
            )
        return api_response(
            success=False,
            message="Erreur lors de la mise à jour de la formation.",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    @extend_schema(
        summary="Formations mises en avant",
        description="Récupère les formations mises en avant"
    )
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def featured(self, request):
        queryset = self.get_queryset().filter(is_featured=True, status='PUBLISHED')
        serializer = TrainingListSerializer(queryset, many=True)
        return api_response(
            success=True,
            message="Formations mises en avant récupérées avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

    @extend_schema(
        summary="Publier une formation (Admin/Super Admin)",
        description="Publie une formation en brouillon - Réservé aux Admin et Super Admin"
    )
    @action(detail=True, methods=['post'])
    def publish(self, request, slug=None):
        # Only Admin and Super Admin can publish
        if not hasattr(request.user, 'role') or request.user.role not in ['SUPER_ADMIN', 'ADMIN']:
            return api_response(
                success=False,
                message="Vous n'avez pas la permission de publier des formations.",
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        instance = self.get_object()
        instance.status = 'PUBLISHED'
        instance.published_at = timezone.now()
        instance.save()
        
        serializer = self.get_serializer(instance)
        return api_response(
            success=True,
            message="Formation publiée avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

    @extend_schema(
        summary="Archiver une formation",
        description="Archive une formation - Accessible aux Admin, Super Admin et Editor"
    )
    @action(detail=True, methods=['post'])
    def archive(self, request, slug=None):
        instance = self.get_object()
        
        # Editors can only archive their own trainings
        if hasattr(request.user, 'role') and request.user.role == 'EDITOR':
            if instance.created_by != request.user:
                return api_response(
                    success=False,
                    message="Vous ne pouvez archiver que vos propres formations.",
                    status_code=status.HTTP_403_FORBIDDEN
                )
        
        instance.status = 'ARCHIVED'
        instance.save()
        
        serializer = self.get_serializer(instance)
        return api_response(
            success=True,
            message="Formation archivée avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

    @extend_schema(
        summary="Mettre en brouillon une formation (Admin/Super Admin)",
        description="Repasse une formation en brouillon - Réservé aux Admin et Super Admin"
    )
    @action(detail=True, methods=['post'])
    def draft(self, request, slug=None):
        # Only Admin and Super Admin can set to draft
        if not hasattr(request.user, 'role') or request.user.role not in ['SUPER_ADMIN', 'ADMIN']:
            return api_response(
                success=False,
                message="Vous n'avez pas la permission de mettre des formations en brouillon.",
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        instance = self.get_object()
        instance.status = 'DRAFT'
        instance.save()
        
        serializer = self.get_serializer(instance)
        return api_response(
            success=True,
            message="Formation mise en brouillon avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

    @extend_schema(
        summary="Dupliquer une formation",
        description="Crée une copie d'une formation existante avec toutes ses données - Accessible aux Admin, Super Admin et Editor"
    )
    @action(detail=True, methods=['post'])
    def duplicate(self, request, slug=None):
        """Dupliquer une formation existante"""
        from django.utils.text import slugify
        
        original = self.get_object()
        
        # Préparer les données pour la copie
        duplicate_data = {
            'title': f"{original.title} (Copie)",
            'short_description': original.short_description,
            'description': original.description,
            'category': original.category,
            'objectives': original.objectives,
            'prerequisites': original.prerequisites,
            'target_audience': original.target_audience,
            'syllabus': original.syllabus,
            'duration': original.duration,
            'level': original.level,
            'price': original.price,
            'currency': original.currency,
            'start_date': original.start_date,
            'end_date': original.end_date,
            'location': original.location,
            'training_mode': original.training_mode,
            'capacity': original.capacity,
            'max_participants': original.max_participants,
            'sessions_count': original.sessions_count,
            'session_duration': original.session_duration,
            'frequency': original.frequency,
            'certification': original.certification,
            'is_featured': False,
            'status': 'DRAFT',  # Force draft
            # Champs marketing
            'for_who': original.for_who,
            'access_prerequisites': original.access_prerequisites,
            'problems_solved': original.problems_solved,
            'deliverables': original.deliverables,
            'skills_acquired': original.skills_acquired,
            'transformation_before': original.transformation_before,
            'transformation_after': original.transformation_after,
            'included_items': original.included_items,
            'not_included_items': original.not_included_items,
            'strategic_positioning': original.strategic_positioning,
            'payment_terms': original.payment_terms,
            'premium_options': original.premium_options,
            'created_by': request.user,
        }
        
        # Copier les images si elles existent
        if original.image:
            duplicate_data['image'] = original.image
        if original.banner:
            duplicate_data['banner'] = original.banner
        
        # Copier l'instructeur
        if original.instructor:
            duplicate_data['instructor'] = original.instructor
        
        # Créer la copie
        duplicated = Training.objects.create(**duplicate_data)
        
        # Générer un slug unique
        base_slug = slugify(duplicated.title)
        unique_slug = base_slug
        counter = 1
        while Training.objects.filter(slug=unique_slug).exists():
            unique_slug = f"{base_slug}-{counter}"
            counter += 1
        duplicated.slug = unique_slug
        duplicated.save()
        
        serializer = self.get_serializer(duplicated)
        return api_response(
            success=True,
            message="Formation dupliquée avec succès.",
            data=serializer.data,
            status_code=status.HTTP_201_CREATED
        )

    def destroy(self, request, *args, **kwargs):
        """
        Soft delete a training - Only Admin and Super Admin can delete
        """
        # Only Admin and Super Admin can delete
        if not hasattr(request.user, 'role') or request.user.role not in ['SUPER_ADMIN', 'ADMIN']:
            return api_response(
                success=False,
                message="Vous n'avez pas la permission de supprimer des formations.",
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        instance = self.get_object()
        
        # Soft delete
        instance.is_deleted = True
        instance.deleted_at = timezone.now()
        instance.save()
        
        return api_response(
            success=True,
            message="Formation supprimée avec succès.",
            status_code=status.HTTP_200_OK
        )



# ========================
# Enrollment Views
# ========================

from rest_framework.decorators import api_view, permission_classes as decorators_permission_classes
from rest_framework.permissions import AllowAny
from .models import Enrollment
from .serializers import (
    EnrollmentSerializer,
    EnrollmentCreateSerializer,
    PaymentInitiationResponseSerializer
)
from .services import FedaPayService
import json


class EnrollmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour gérer les inscriptions aux formations.
    """
    queryset = Enrollment.objects.all()
    permission_classes = [AllowAny]  # Accessible publiquement
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'training', 'education_level']
    search_fields = ['full_name', 'email', 'phone']
    ordering_fields = ['created_at', 'paid_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return EnrollmentCreateSerializer
        return EnrollmentSerializer
    
    def get_queryset(self):
        """
        Filtrer les enrollments selon les permissions.
        Les admins voient tout, les autres ne voient que leurs propres inscriptions.
        """
        queryset = super().get_queryset()
        
        # Admin / Staff voit tout
        if self.request.user.is_authenticated and (
            getattr(self.request.user, 'is_admin', False)
            or getattr(self.request.user, 'role', '') in ['ADMIN', 'SUPER_ADMIN']
            or self.request.user.is_staff
            or self.request.user.is_superuser
        ):
            return queryset
        
        # Public : accès par ID uniquement (retrieve + custom payment actions)
        PUBLIC_ACTIONS = {'retrieve', 'initiate_payment', 'retry_payment'}
        if self.action in PUBLIC_ACTIONS:
            return queryset
        
        # Par défaut, rien
        return queryset.none()
    
    def create(self, request, *args, **kwargs):
        """
        Crée une inscription avec status PENDING.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        enrollment = serializer.save()
        
        # Retourner l'enrollment complet
        response_serializer = EnrollmentSerializer(enrollment)
        
        return Response({
            'success': True,
            'message': 'Inscription créée avec succès. Veuillez procéder au paiement.',
            'data': response_serializer.data
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'], url_path='initiate-payment', permission_classes=[AllowAny])
    def initiate_payment(self, request, pk=None):
        """
        Initie le paiement FedaPay pour une inscription.
        
        POST /api/v1/trainings/enrollments/{id}/initiate-payment/
        """
        enrollment = self.get_object()
        
        # Vérifier que le paiement est possible
        if not enrollment.can_retry_payment():
            return Response({
                'success': False,
                'message': 'Cette inscription ne peut plus être payée (expirée ou déjà payée).'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Créer la transaction FedaPay
            payment_data = FedaPayService.create_transaction(enrollment)
            
            response_data = {
                'checkout_url': payment_data['checkout_url'],
                'transaction_id': payment_data['transaction_id'],
                'enrollment_id': str(enrollment.id)
            }
            
            return Response({
                'success': True,
                'message': 'Transaction créée avec succès.',
                'data': response_data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['post'], url_path='retry-payment', permission_classes=[AllowAny])
    def retry_payment(self, request, pk=None):
        """
        Réessayer le paiement pour une inscription échouée.
        
        POST /api/v1/trainings/enrollments/{id}/retry-payment/
        """
        enrollment = self.get_object()
        
        # Vérifier que le retry est possible
        if not enrollment.can_retry_payment():
            return Response({
                'success': False,
                'message': 'Cette inscription ne peut plus être payée.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Réinitialiser le statut
        enrollment.status = 'PENDING'
        enrollment.save()
        
        # Initier le paiement
        return self.initiate_payment(request, pk)

    @action(detail=True, methods=['post'], url_path='send-reminder')
    def send_reminder(self, request, pk=None):
        """
        Envoie un email de relance de paiement pour cette inscription.
        POST /api/v1/trainings/enrollments/{id}/send-reminder/
        """
        from .services.reminder_service import PaymentReminderService
        enrollment = self.get_object()
        stage = request.data.get('stage', 'manual')
        success = PaymentReminderService.send_reminder(enrollment, stage=stage)
        if success:
            enrollment.refresh_from_db()
            return Response({
                'success': True,
                'message': f"Email de relance envoyé avec succès à {enrollment.email}.",
                'data': EnrollmentSerializer(enrollment).data
            })
        return Response({
            'success': False,
            'message': "Impossible d'envoyer l'email de relance (inscription déjà payée ou erreur d'envoi)."
        }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='process-reminders')
    def process_reminders(self, request):
        """
        Scanne et traite toutes les relances automatiques en attente (1h, 24h, 7j).
        POST /api/v1/trainings/enrollments/process-reminders/
        """
        from .services.reminder_service import PaymentReminderService
        report = PaymentReminderService.process_all_pending_reminders()
        return Response({
            'success': True,
            'message': "Traitement des relances automatiques terminé.",
            'data': report
        })


@api_view(['POST'])
@decorators_permission_classes([AllowAny])
def enrollment_webhook(request):
    """
    Webhook pour recevoir les notifications de FedaPay.
    
    POST /api/v1/enrollments/webhook/
    """
    try:
        # Récupérer la signature
        signature = request.headers.get('X-FedaPay-Signature', '')
        
        # Vérifier la signature
        if not FedaPayService.verify_webhook_signature(request.body, signature):
            return Response({
                'success': False,
                'message': 'Signature invalide'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Parser le payload
        payload = json.loads(request.body)
        
        # Traiter le webhook
        result = FedaPayService.handle_webhook(payload)
        
        if result['success']:
            return Response(result, status=status.HTTP_200_OK)
        else:
            return Response(result, status=status.HTTP_400_BAD_REQUEST)
            
    except json.JSONDecodeError:
        return Response({
            'success': False,
            'message': 'Payload JSON invalide'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
