"""
Views for contact and newsletter endpoints.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from apps.core.permissions import IsAdminUser
from .models import ContactMessage, NewsletterSubscriber
from .serializers import (
    ContactMessageCreateSerializer,
    ContactMessageDetailSerializer,
    ContactMessageUpdateSerializer,
    NewsletterSubscribeSerializer,
    NewsletterSubscriberDetailSerializer
)


class ContactMessageViewSet(viewsets.ModelViewSet):
    """
    ViewSet for contact messages.
    
    Public endpoints:
    - create: Submit contact form
    
    Admin endpoints:
    - list: Get all messages
    - retrieve: Get message detail
    - update: Update message status
    - mark_resolved: Mark as resolved
    - assign: Assign to user
    """
    queryset = ContactMessage.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'subject']
    search_fields = ['first_name', 'last_name', 'email', 'company', 'message']
    ordering_fields = ['created_at', 'status']
    ordering = ['-created_at']
    
    def get_permissions(self):
        """
        Allow anyone to create, admins only for other actions.
        """
        if self.action == 'create':
            return [AllowAny()]
        return [IsAdminUser()]
    
    def get_serializer_class(self):
        """
        Return appropriate serializer based on action.
        """
        if self.action == 'create':
            return ContactMessageCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return ContactMessageUpdateSerializer
        return ContactMessageDetailSerializer
    
    def list(self, request, *args, **kwargs):
        """
        Override list to add custom response format.
        """
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'message': 'Messages de contact récupérés avec succès',
            'data': serializer.data
        })
    
    def create(self, request, *args, **kwargs):
        """
        Override create to add custom response format.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        return Response({
            'success': True,
            'message': 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
            'data': {'id': serializer.instance.id}
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def mark_resolved(self, request, pk=None):
        """
        Mark message as resolved.
        Admin only.
        """
        message = self.get_object()
        message.mark_as_resolved()
        
        serializer = self.get_serializer(message)
        return Response({
            'success': True,
            'message': 'Message marqué comme résolu',
            'data': serializer.data
        })
    
    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        """
        Assign message to a user.
        Admin only.
        """
        message = self.get_object()
        user_id = request.data.get('user_id')
        
        if not user_id:
            return Response({
                'success': False,
                'message': 'user_id est requis',
                'errors': {'user_id': ['Ce champ est requis']}
            }, status=status.HTTP_400_BAD_REQUEST)
        
        from apps.accounts.models import User
        try:
            user = User.objects.get(id=user_id)
            message.assigned_to = user
            message.status = 'IN_PROGRESS'
            message.save()
            
            serializer = self.get_serializer(message)
            return Response({
                'success': True,
                'message': f'Message assigné à {user.first_name} {user.last_name}',
                'data': serializer.data
            })
        except User.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Utilisateur introuvable',
                'errors': {'user_id': ['Utilisateur invalide']}
            }, status=status.HTTP_404_NOT_FOUND)


class NewsletterViewSet(viewsets.ModelViewSet):
    """
    ViewSet for newsletter subscriptions.
    
    Public endpoints:
    - subscribe: Subscribe to newsletter
    - unsubscribe: Unsubscribe from newsletter
    
    Admin endpoints:
    - list: Get all subscribers
    - retrieve: Get subscriber detail
    """
    queryset = NewsletterSubscriber.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_active', 'is_verified']
    search_fields = ['email', 'first_name', 'last_name']
    ordering_fields = ['created_at', 'email']
    ordering = ['-created_at']
    
    def get_permissions(self):
        """
        Allow anyone to subscribe/unsubscribe, admins only for list/retrieve.
        """
        if self.action in ['subscribe', 'unsubscribe']:
            return [AllowAny()]
        return [IsAdminUser()]
    
    def get_serializer_class(self):
        """
        Return appropriate serializer based on action.
        """
        if self.action == 'subscribe':
            return NewsletterSubscribeSerializer
        return NewsletterSubscriberDetailSerializer
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def subscribe(self, request):
        """
        Subscribe to newsletter.
        """
        serializer = NewsletterSubscribeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        subscriber = serializer.save()
        
        return Response({
            'success': True,
            'message': 'Inscription réussie ! Merci de vous être abonné à notre newsletter.',
            'data': {'email': subscriber.email}
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def unsubscribe(self, request):
        """
        Unsubscribe from newsletter.
        """
        email = request.data.get('email', '').lower().strip()
        
        if not email:
            return Response({
                'success': False,
                'message': 'Email requis',
                'errors': {'email': ['Ce champ est requis']}
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            subscriber = NewsletterSubscriber.objects.get(email=email, is_active=True)
            subscriber.unsubscribe()
            
            return Response({
                'success': True,
                'message': 'Vous avez été désabonné de notre newsletter.',
                'data': None
            })
        except NewsletterSubscriber.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Email non trouvé ou déjà désabonné',
                'errors': {'email': ['Cet email n\'est pas inscrit']}
            }, status=status.HTTP_404_NOT_FOUND)
    
    def list(self, request, *args, **kwargs):
        """
        Override list to add custom response format.
        """
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'message': 'Abonnés récupérés avec succès',
            'data': serializer.data
        })
