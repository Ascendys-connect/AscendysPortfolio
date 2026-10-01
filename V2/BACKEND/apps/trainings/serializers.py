"""
Serializers for Training and TrainingCategory models.
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import TrainingCategory, Training

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
        """Return count of published and non-deleted trainings in this category."""
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
        """Validate that start_date is not in the past."""
        from django.utils import timezone
        from datetime import date
        
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
