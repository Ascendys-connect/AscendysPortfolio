"""
Serializers for notifications.
"""
from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    """
    Serializer for Notification objects.
    """
    type_display = serializers.CharField(source='get_type_display', read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id',
            'type',
            'type_display',
            'title',
            'message',
            'link',
            'is_read',
            'read_at',
            'metadata',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'type', 'type_display', 'title', 'message', 'link', 'read_at', 'metadata', 'created_at', 'updated_at']


class UnreadCountSerializer(serializers.Serializer):
    """
    Serializer for unread notifications count.
    """
    unread_count = serializers.IntegerField()
