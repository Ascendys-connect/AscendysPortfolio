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
    action_display = serializers.CharField(source='get_action_display', read_only=True)
    content_type_name = serializers.SerializerMethodField()
    
    class Meta:
        model = ActivityLog
        fields = [
            'id',
            'user',
            'user_name',
            'action',
            'action_display',
            'description',
            'content_type',
            'content_type_name',
            'object_id',
            'ip_address',
            'metadata',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_user_name(self, obj):
        """Get user full name."""
        if obj.user:
            return obj.user.get_full_name()
        return "Système"
    
    def get_content_type_name(self, obj):
        """Get content type model name."""
        if obj.content_type:
            return obj.content_type.model
        return None
