"""
Serializers for Training and TrainingCategory models.
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import TrainingCategory, Training, Enrollment

User = get_user_model()


class TrainingCategorySerializer(serializers.ModelSerializer):
    """
    Serializer for TrainingCategory model.
    """
    trainings_count = serializers.SerializerMethodField()
    
    class Meta:
        model = TrainingCategory
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'image',
            'is_active',
            'trainings_count',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']
    
    def get_trainings_count(self, obj):
        """
        Return count of trainings in this category.
        If user is authenticated admin/staff, return all non-deleted trainings.
        Otherwise, return published non-deleted trainings.
        """
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated and (
            getattr(request.user, 'is_admin', False) or 
            request.user.is_staff or 
            getattr(request.user, 'role', '') in ['ADMIN', 'SUPER_ADMIN']
        ):
            return obj.trainings.filter(is_deleted=False).count()
        return obj.trainings.filter(status='PUBLISHED', is_deleted=False).count()


class TrainingCategoryCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating/updating TrainingCategory.
    """
    class Meta:
        model = TrainingCategory
        fields = [
            'name',
            'description',
            'image',
            'is_active',
        ]


class InstructorSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for instructor information.
    """
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'avatar']


class TrainingListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for listing trainings.
    """
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Training
        fields = [
            'id',
            'title',
            'slug',
            'short_description',
            'category_name',
            'image',
            'duration',
            'level',
            'price',
            'currency',
            'training_mode',
            'is_featured',
            'start_date',
            'status',
            'views_count',
            'created_at',
        ]


class TrainingSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for Training model.
    """
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    instructor_name = serializers.CharField(source='instructor.get_full_name', read_only=True)
    level_display = serializers.CharField(source='get_level_display', read_only=True)
    mode_display = serializers.CharField(source='get_training_mode_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Training
        fields = [
            'id',
            'title',
            'slug',
            'short_description',
            'description',
            'category',
            'category_name',
            'category_slug',
            'image',
            'banner',
            'objectives',
            'prerequisites',
            'target_audience',
            'syllabus',
            'duration',
            'level',
            'level_display',
            'price',
            'currency',
            'start_date',
            'end_date',
            'location',
            'training_mode',
            'mode_display',
            'instructor',
            'instructor_name',
            'capacity',
            'max_participants',
            'sessions_count',
            'session_duration',
            'frequency',
            'for_who',
            'access_prerequisites',
            'problems_solved',
            'deliverables',
            'skills_acquired',
            'transformation_before',
            'transformation_after',
            'included_items',
            'not_included_items',
            'strategic_positioning',
            'payment_terms',
            'premium_options',
            'certification',
            'status',
            'status_display',
            'is_featured',
            'views_count',
            'published_at',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'slug', 'views_count', 'published_at', 'created_at', 'updated_at']


class TrainingCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating trainings.
    """
    class Meta:
        model = Training
        fields = [
            'title',
            'short_description',
            'description',
            'category',
            'image',
            'banner',
            'objectives',
            'prerequisites',
            'target_audience',
            'syllabus',
            'duration',
            'level',
            'price',
            'currency',
            'start_date',
            'end_date',
            'location',
            'training_mode',
            'instructor',
            'capacity',
            'max_participants',
            'sessions_count',
            'session_duration',
            'frequency',
            'for_who',
            'access_prerequisites',
            'problems_solved',
            'deliverables',
            'skills_acquired',
            'transformation_before',
            'transformation_after',
            'included_items',
            'not_included_items',
            'strategic_positioning',
            'payment_terms',
            'premium_options',
            'certification',
            'status',
            'is_featured',
        ]

    def validate_title(self, value):
        """Validate that title is not empty."""
        if not value or not value.strip():
            raise serializers.ValidationError("Le titre ne peut pas être vide.")
        return value.strip()

    def validate_start_date(self, value):
        """Validate that start_date is not in the past (only on creation)."""
        from django.utils import timezone
        
        # En mode édition, on accepte la date existante même si elle est passée
        instance = getattr(self, 'instance', None)
        if instance and instance.start_date == value:
            return value
        
        today = timezone.now().date()
        if value < today:
            raise serializers.ValidationError("La date de début ne peut pas être antérieure à aujourd'hui.")
        return value

    def validate(self, data):
        """Validate that end_date is after start_date."""
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        
        if start_date and end_date and end_date < start_date:
            raise serializers.ValidationError({
                'end_date': 'La date de fin doit être postérieure à la date de début.'
            })
        
        return data



class EnrollmentSerializer(serializers.ModelSerializer):
    """
    Serializer pour les inscriptions aux formations.
    """
    training_title = serializers.CharField(source='training.title', read_only=True)
    training_price = serializers.DecimalField(
        source='training.price',
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    training_slug = serializers.CharField(source='training.slug', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    education_level_display = serializers.CharField(source='get_education_level_display', read_only=True)
    is_expired = serializers.BooleanField(read_only=True)
    can_retry_payment = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Enrollment
        fields = [
            'id',
            'training',
            'training_title',
            'training_slug',
            'training_price',
            'full_name',
            'email',
            'phone',
            'education_level',
            'education_level_display',
            'education_level_other',
            'status',
            'status_display',
            'amount',
            'currency',
            'payment_id',
            'payment_attempts',
            'is_expired',
            'can_retry_payment',
            'reminder_1h_sent_at',
            'reminder_24h_sent_at',
            'reminder_7d_sent_at',
            'reminders_count',
            'expires_at',
            'paid_at',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'payment_id',
            'payment_attempts',
            'reminder_1h_sent_at',
            'reminder_24h_sent_at',
            'reminder_7d_sent_at',
            'reminders_count',
            'expires_at',
            'paid_at',
            'created_at',
            'updated_at',
        ]


class EnrollmentCreateSerializer(serializers.ModelSerializer):
    """
    Serializer pour créer une inscription.
    """
    class Meta:
        model = Enrollment
        fields = [
            'training',
            'full_name',
            'email',
            'phone',
            'education_level',
            'education_level_other',
        ]
    
    def validate_email(self, value):
        """Valide le format de l'email."""
        if not value or '@' not in value:
            raise serializers.ValidationError("Veuillez fournir un email valide.")
        return value.lower().strip()
    
    def validate_phone(self, value):
        """Valide le numéro de téléphone."""
        if not value or len(value) < 8:
            raise serializers.ValidationError("Veuillez fournir un numéro de téléphone valide.")
        return value.strip()
    
    def validate_full_name(self, value):
        """Valide le nom complet."""
        if not value or len(value.strip()) < 3:
            raise serializers.ValidationError("Le nom complet doit contenir au moins 3 caractères.")
        return value.strip()
    
    def validate(self, data):
        """Validation croisée."""
        # Si "Autre" est sélectionné, education_level_other est requis
        if data.get('education_level') == 'OTHER' and not data.get('education_level_other'):
            raise serializers.ValidationError({
                'education_level_other': 'Veuillez préciser votre niveau d\'études.'
            })
        
        # Vérifier que la formation existe et est publiée
        training = data.get('training')
        if training.status != 'PUBLISHED':
            raise serializers.ValidationError({
                'training': 'Cette formation n\'est pas disponible pour inscription.'
            })
        
        # Vérifier que la formation n'a pas déjà commencé
        from django.utils import timezone
        if training.start_date < timezone.now().date():
            raise serializers.ValidationError({
                'training': 'Cette formation a déjà commencé.'
            })
        
        return data
    
    def create(self, validated_data):
        """Crée une inscription avec status PENDING."""
        training = validated_data['training']
        enrollment = Enrollment.objects.create(
            **validated_data,
            amount=training.price,
            currency=training.currency,
            status='PENDING'
        )
        return enrollment


class PaymentInitiationResponseSerializer(serializers.Serializer):
    """
    Serializer pour la réponse d'initiation de paiement.
    """
    checkout_url = serializers.URLField()
    transaction_id = serializers.CharField()
    enrollment_id = serializers.UUIDField()

