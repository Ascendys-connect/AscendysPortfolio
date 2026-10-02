"""
Serializers for Event model.
"""
from rest_framework import serializers
from django.utils import timezone
from .models import Event


class EventListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for listing events.
    """
    type_display = serializers.CharField(source='get_event_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Event
        fields = [
            'id',
            'title',
            'slug',
            'image',
            'location',
            'event_type',
            'type_display',
            'start_datetime',
            'end_datetime',
            'capacity',
            'status',
            'status_display',
            'is_featured',
            'created_at',
        ]


class EventSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for Event model.
    """
    type_display = serializers.CharField(source='get_event_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    is_upcoming = serializers.SerializerMethodField()
    is_ongoing = serializers.SerializerMethodField()
    
    class Meta:
        model = Event
        fields = [
            'id',
            'title',
            'slug',
            'description',
            'image',
            'location',
            'event_type',
            'type_display',
            'start_datetime',
            'end_datetime',
            'registration_url',
            'capacity',
            'status',
            'status_display',
            'is_featured',
            'is_upcoming',
            'is_ongoing',
            'created_by',
            'created_by_name',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']
    
    def get_is_upcoming(self, obj):
        """Check if event is upcoming."""
        return obj.is_upcoming()
    
    def get_is_ongoing(self, obj):
        """Check if event is ongoing."""
        return obj.is_ongoing()


class EventCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating events.
    """
    class Meta:
        model = Event
        fields = [
            'title',
            'description',
            'image',
            'location',
            'event_type',
            'start_datetime',
            'end_datetime',
            'registration_url',
            'capacity',
            'status',
            'is_featured',
        ]

    def validate_title(self, value):
        """Validate that title is not empty."""
        if not value or not value.strip():
            raise serializers.ValidationError("Le titre ne peut pas être vide.")
        return value.strip()

    def validate_start_datetime(self, value):
        """Validate that start_datetime is not in the past for new events."""
        if not self.instance and value < timezone.now():
            raise serializers.ValidationError(
                "La date de début ne peut pas être antérieure à aujourd'hui."
            )
        return value

    def validate(self, data):
        """Validate that end_datetime is after start_datetime."""
        start_datetime = data.get('start_datetime') or (self.instance.start_datetime if self.instance else None)
        end_datetime = data.get('end_datetime') or (self.instance.end_datetime if self.instance else None)
        
        if start_datetime and end_datetime and end_datetime <= start_datetime:
            raise serializers.ValidationError({
                'end_datetime': 'La date de fin doit être postérieure à la date de début.'
            })
        
        return data
