"""
Serializers for Testimonial model.
"""
from rest_framework import serializers
from .models import Testimonial


class TestimonialListSerializer(serializers.ModelSerializer):
    """
    Serializer for Testimonial list (minimal data).
    """
    class Meta:
        model = Testimonial
        fields = [
            'id',
            'name',
            'role',
            'company',
            'avatar',
            'content',
            'rating',
            'is_featured',
            'is_published',
            'order'
        ]
        read_only_fields = ['id']


class TestimonialDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for Testimonial detail.
    """
    class Meta:
        model = Testimonial
        fields = [
            'id',
            'name',
            'role',
            'company',
            'avatar',
            'content',
            'rating',
            'is_featured',
            'is_published',
            'order',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class TestimonialSerializer(serializers.ModelSerializer):
    """
    Serializer for Testimonial model.
    """
    class Meta:
        model = Testimonial
        fields = [
            'id',
            'name',
            'role',
            'company',
            'avatar',
            'content',
            'rating',
            'is_featured',
            'is_published',
            'order',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class TestimonialCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating testimonials.
    """
    class Meta:
        model = Testimonial
        fields = [
            'name',
            'role',
            'company',
            'avatar',
            'content',
            'rating',
            'is_featured',
            'is_published',
            'order',
        ]

    def validate_name(self, value):
        """Validate that name is not empty."""
        if not value or not value.strip():
            raise serializers.ValidationError("Le nom ne peut pas être vide.")
        return value.strip()

    def validate_rating(self, value):
        """Validate rating is between 1 and 5."""
        if value < 1 or value > 5:
            raise serializers.ValidationError("La note doit être entre 1 et 5.")
        return value
