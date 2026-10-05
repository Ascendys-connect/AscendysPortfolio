"""
Serializers for Offer model.
"""
from rest_framework import serializers
from .models import Offer


class OfferListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for listing offers.
    """
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    is_active = serializers.SerializerMethodField()
    
    class Meta:
        model = Offer
        fields = [
            'id',
            'title',
            'slug',
            'short_description',
            'image',
            'type',
            'type_display',
            'status',
            'status_display',
            'is_featured',
            'is_active',
            'start_date',
            'end_date',
            'created_at',
        ]
    
    def get_is_active(self, obj):
        """Check if offer is currently active."""
        return obj.is_active_offer()


class OfferSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for Offer model.
    """
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    is_active = serializers.SerializerMethodField()
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = Offer
        fields = [
            'id',
            'title',
            'slug',
            'short_description',
            'description',
            'image',
            'banner',
            'type',
            'type_display',
            'start_date',
            'end_date',
            'status',
            'status_display',
            'is_featured',
            'is_active',
            'published_at',
            'created_by',
            'created_by_name',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'slug', 'published_at', 'created_at', 'updated_at']
    
    def get_is_active(self, obj):
        """Check if offer is currently active."""
        return obj.is_active_offer()


class OfferCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating offers.
    """
    class Meta:
        model = Offer
        fields = [
            'title',
            'short_description',
            'description',
            'image',
            'banner',
            'type',
            'start_date',
            'end_date',
            'status',
            'is_featured',
        ]

    def validate_title(self, value):
        """Validate that title is not empty."""
        if not value or not value.strip():
            raise serializers.ValidationError("Le titre ne peut pas être vide.")
        return value.strip()

    def validate(self, data):
        """Validate that end_date is after start_date."""
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        
        if start_date and end_date and end_date < start_date:
            raise serializers.ValidationError({
                'end_date': 'La date de fin doit être postérieure à la date de début.'
            })
        
        return data
