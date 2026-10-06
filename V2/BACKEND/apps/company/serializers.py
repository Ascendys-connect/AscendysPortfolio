"""
Serializers for Company model.
"""
import json
from rest_framework import serializers
from .models import Company


class CompanySerializer(serializers.ModelSerializer):
    """
    Serializer for Company model.
    """
    logo_url = serializers.SerializerMethodField()
    favicon_url = serializers.SerializerMethodField()
    tagline = serializers.CharField(source='slogan', read_only=True)
    description = serializers.CharField(source='short_description', read_only=True)
    facebook_url = serializers.SerializerMethodField()
    twitter_url = serializers.SerializerMethodField()
    linkedin_url = serializers.SerializerMethodField()
    instagram_url = serializers.SerializerMethodField()
    youtube_url = serializers.SerializerMethodField()
    whatsapp_number = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = [
            'id',
            'name',
            'slogan',
            'tagline',
            'short_description',
            'description',
            'full_description',
            'logo',
            'logo_url',
            'favicon',
            'favicon_url',
            'email',
            'phone',
            'phones',
            'address',
            'city',
            'country',
            'postal_code',
            'website',
            'social_links',
            'facebook_url',
            'twitter_url',
            'linkedin_url',
            'instagram_url',
            'youtube_url',
            'whatsapp_number',
            'founded_year',
            'mission',
            'vision',
            'values',
            'business_hours',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def _build_url(self, field):
        request = self.context.get('request')
        if field:
            if request:
                return request.build_absolute_uri(field.url)
            return field.url
        return None

    def get_logo_url(self, obj): return self._build_url(obj.logo)
    def get_favicon_url(self, obj): return self._build_url(obj.favicon)

    def _get_social(self, obj, key):
        if isinstance(obj.social_links, dict):
            return obj.social_links.get(key, '')
        return ''

    def get_facebook_url(self, obj): return self._get_social(obj, 'facebook')
    def get_twitter_url(self, obj): return self._get_social(obj, 'twitter')
    def get_linkedin_url(self, obj): return self._get_social(obj, 'linkedin')
    def get_instagram_url(self, obj): return self._get_social(obj, 'instagram')
    def get_youtube_url(self, obj): return self._get_social(obj, 'youtube')
    def get_whatsapp_number(self, obj): return self._get_social(obj, 'whatsapp')


class CompanyUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating Company information.
    """
    phones = serializers.JSONField(required=False)
    social_links = serializers.JSONField(required=False)
    logo = serializers.ImageField(required=False, allow_null=True)
    favicon = serializers.ImageField(required=False, allow_null=True)

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
            'phones',
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

    def to_internal_value(self, data):
        # Convert QueryDict or multipart data to standard Python dict
        raw = {}
        if hasattr(data, 'dict'):
            raw = data.dict()
        else:
            for k in data:
                raw[k] = data.get(k)

        # Include files from request.FILES if available in context
        request = self.context.get('request')
        if request and hasattr(request, 'FILES'):
            for fk, fv in request.FILES.items():
                raw[fk] = fv

        # Map tagline -> slogan if present
        if 'tagline' in raw and not raw.get('slogan'):
            raw['slogan'] = raw.get('tagline')

        # Map description -> short_description if present
        if 'description' in raw and not raw.get('short_description'):
            raw['short_description'] = raw.get('description')

        # Parse phones if string or list
        if 'phones' in raw:
            val = raw['phones']
            if isinstance(val, str):
                try:
                    raw['phones'] = json.loads(val)
                except Exception:
                    raw['phones'] = [p.strip() for p in val.split(',') if p.strip()]

        # Social links mapping
        social_links = raw.get('social_links', {})
        if isinstance(social_links, str):
            try:
                social_links = json.loads(social_links)
            except Exception:
                social_links = {}
        elif not isinstance(social_links, dict):
            social_links = {}

        for platform in ['facebook', 'twitter', 'linkedin', 'instagram', 'youtube', 'whatsapp']:
            field_name = f'{platform}_url' if platform != 'whatsapp' else 'whatsapp_number'
            if field_name in raw and raw[field_name]:
                social_links[platform] = raw[field_name]

        if social_links:
            raw['social_links'] = social_links

        return super().to_internal_value(raw)


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
