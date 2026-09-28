"""
Serializers for Company model.
"""
from rest_framework import serializers
from .models import Company


class CompanySerializer(serializers.ModelSerializer):
    """
    Serializer for Company model.
    """
    class Meta:
        model = Company
        fields = [
            'id',
            'name',
            'slogan',
            'short_description',
            'full_description',
            'logo',
            'favicon',
            'email',
            'phone',
            'address',
            'city',
            'country',
            'postal_code',
            'website',
            'social_links',
            'founded_year',
            'mission',
            'vision',
            'values',
            'business_hours',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class CompanyUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating Company information.
    """
    class Meta:
        model = Company
        fields = [
            'name',
            'slogan',
            'short_description',
            'full_description',
            'logo',
            'favicon',
            'email',
            'phone',
            'address',
            'city',
            'country',
            'postal_code',
            'website',
            'social_links',
            'founded_year',
            'mission',
            'vision',
            'values',
            'business_hours',
        ]


class CompanyAboutSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for 'About' page.
    """
    class Meta:
        model = Company
        fields = [
            'name',
            'slogan',
            'full_description',
            'logo',
            'founded_year',
            'mission',
            'vision',
            'values',
            'email',
            'phone',
            'address',
            'city',
            'country',
            'social_links',
        ]
