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


class OptionalDateField(serializers.DateField):
    """DateField that converts empty strings or 'null' to None, or raises error if required."""
    def to_internal_value(self, value):
        if value in (None, '', 'null'):
            if self.required:
                self.fail('required')
            return None
        return super().to_internal_value(value)


class OptionalImageField(serializers.ImageField):
    """ImageField that skips existing string URLs and converts empty strings to None."""
    def to_internal_value(self, data):
        if data in (None, '', 'null'):
            return None
        if isinstance(data, str):
            raise serializers.SkipField()
        return super().to_internal_value(data)


class OfferCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating offers.
    """
    image = OptionalImageField(required=False, allow_null=True)
    banner = OptionalImageField(required=False, allow_null=True)
    start_date = OptionalDateField(required=True, allow_null=False)
    end_date = OptionalDateField(required=True, allow_null=False)

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
        """Validate dates logic and that at least one image is provided."""
        errors = {}

        start_date = data.get('start_date')
        end_date = data.get('end_date')

        if not start_date:
            errors['start_date'] = 'La date de début est obligatoire.'
        if not end_date:
            errors['end_date'] = 'La date de fin est obligatoire.'
        if start_date and end_date and end_date < start_date:
            errors['end_date'] = 'La date de fin doit être postérieure à la date de début.'

        # On creation (no instance), require at least one image or banner
        if not self.instance:
            image = data.get('image')
            banner = data.get('banner')
            if not image and not banner:
                errors['image'] = 'Veuillez fournir au moins une image ou une bannière.'

        if errors:
            raise serializers.ValidationError(errors)

        return data
