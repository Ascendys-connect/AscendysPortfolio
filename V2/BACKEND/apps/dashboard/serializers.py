"""
Serializers for dashboard and activity logs.
"""
from rest_framework import serializers
from .models import ActivityLog


class ActivityLogSerializer(serializers.ModelSerializer):
    """
    Serializer for activity logs.
    """
    user_name = serializers.SerializerMethodField()
    user_email = serializers.SerializerMethodField()
    user_avatar = serializers.SerializerMethodField()
    action_display = serializers.CharField(source='get_action_display', read_only=True)
    content_type_name = serializers.SerializerMethodField()

    class Meta:
        model = ActivityLog
        fields = [
            'id',
            'user',
            'user_name',
            'user_email',
            'user_avatar',
            'action',
            'action_display',
            'description',
            'content_type',
            'content_type_name',
            'object_id',
            'ip_address',
            'metadata',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def get_user_name(self, obj):
        """Get user full name."""
        if obj.user:
            full = obj.user.get_full_name().strip()
            return full if full else obj.user.email
        return "Système"

    def get_user_email(self, obj):
        """Get user email."""
        return obj.user.email if obj.user else None

    def get_user_avatar(self, obj):
        """Get user avatar URL."""
        if obj.user and hasattr(obj.user, 'avatar') and obj.user.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.user.avatar.url)
        return None

    def get_content_type_name(self, obj):
        """Get content type model name."""
        if obj.content_type:
            return obj.content_type.model
        return None
