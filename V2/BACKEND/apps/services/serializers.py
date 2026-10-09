import json
from rest_framework import serializers
from .models import Service


class OptionalFileField(serializers.FileField):
    """
    FileField that ignores existing string paths (SkipField)
    and allows null/empty values.
    """
    def to_internal_value(self, data):
        if data is None or data == '' or data == 'null':
            return None
        if isinstance(data, str):
            raise serializers.SkipField()
        return super().to_internal_value(data)


class OptionalImageField(serializers.ImageField):
    """
    ImageField that ignores existing string paths (SkipField)
    and allows null/empty values.
    """
    def to_internal_value(self, data):
        if data is None or data == '' or data == 'null':
            return None
        if isinstance(data, str):
            raise serializers.SkipField()
        return super().to_internal_value(data)


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
            'is_featured',
            'is_active',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']


class ServiceCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating Service data.
    """
    icon = OptionalFileField(required=False, allow_null=True)
    image = OptionalImageField(required=False, allow_null=True)

    class Meta:
        model = Service
        fields = [
            'title',
            'short_description',
            'description',
            'icon',
            'image',
            'features',
            'is_featured',
            'is_active',
        ]

    def validate_title(self, value):
        """
        Validate that title is not empty.
        """
        if not value or not value.strip():
            raise serializers.ValidationError("Le titre ne peut pas être vide.")
        return value.strip()

    def validate_features(self, value):
        """
        Ensure features is parsed into a list.
        """
        if isinstance(value, str):
            try:
                value = json.loads(value)
            except Exception:
                value = []
        if not isinstance(value, list):
            value = []
        return value

    def validate(self, attrs):
        """
        Ensure at least one of icon or image is provided (either one or both, but never both empty).
        """
        current_icon = getattr(self.instance, 'icon', None) if self.instance else None
        current_image = getattr(self.instance, 'image', None) if self.instance else None

        icon = attrs.get('icon', current_icon)
        image = attrs.get('image', current_image)

        if not icon and not image:
            raise serializers.ValidationError(
                {"media": "Vous devez obligatoirement fournir au moins une icône ou une image (soit l'une, soit l'autre, ou les deux)."}
            )
        return attrs


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
            'description',
            'icon',
            'image',
            'features',
            'is_featured',
            'is_active',
        ]
