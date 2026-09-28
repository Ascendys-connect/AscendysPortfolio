"""
Serializers for Service model.
"""
from rest_framework import serializers
from .models import Service


class ServiceSerializer(serializers.ModelSerializer):
    """
    Serializer for reading Service data.
    """
    class Meta:
        model = Service
        fields = [
            'id',
            'title',
            'slug',
            'short_description',
            'description',
            'icon',
            'image',
            'features',
            'order',
            'is_featured',
            'is_active',
            'seo_title',
            'seo_description',
            'seo_keywords',
            'og_image',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']


class ServiceCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating Service data.
    """
    class Meta:
        model = Service
        fields = [
            'title',
            'short_description',
            'description',
            'icon',
            'image',
            'features',
            'order',
            'is_featured',
            'is_active',
            'seo_title',
            'seo_description',
            'seo_keywords',
            'og_image',
        ]

    def validate_title(self, value):
        """
        Validate that title is not empty.
        """
        if not value or not value.strip():
            raise serializers.ValidationError("Le titre ne peut pas être vide.")
        return value.strip()


class ServiceListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for listing services.
    """
    class Meta:
        model = Service
        fields = [
            'id',
            'title',
            'slug',
            'short_description',
            'icon',
            'image',
            'is_featured',
            'order',
        ]
