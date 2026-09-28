"""
Serializers for Partner model.
"""
from rest_framework import serializers
from .models import Partner


class PartnerListSerializer(serializers.ModelSerializer):
    """
    Serializer for Partner list (minimal data).
    """
    class Meta:
        model = Partner
        fields = [
            'id',
            'name',
            'logo',
            'website',
            'is_featured',
            'is_active',
            'order'
        ]
        read_only_fields = ['id']


class PartnerDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for Partner detail.
    """
    class Meta:
        model = Partner
        fields = [
            'id',
            'name',
            'logo',
            'website',
            'description',
            'is_featured',
            'is_active',
            'order',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PartnerCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating/updating Partner.
    """
    class Meta:
        model = Partner
        fields = [
            'name',
            'logo',
            'website',
            'description',
            'is_featured',
            'is_active',
            'order'
        ]

    def validate_name(self, value):
        """
        Validate partner name uniqueness.
        """
        instance = self.instance
        if instance:
            # Update case
            if Partner.objects.exclude(pk=instance.pk).filter(name=value).exists():
                raise serializers.ValidationError(
                    "Un partenaire avec ce nom existe déjà."
                )
        else:
            # Create case
            if Partner.objects.filter(name=value).exists():
                raise serializers.ValidationError(
                    "Un partenaire avec ce nom existe déjà."
                )
        return value
