"""
Serializers for contact and newsletter models.
"""
from rest_framework import serializers
from .models import ContactMessage, NewsletterSubscriber


class ContactMessageCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating contact messages.
    """
    class Meta:
        model = ContactMessage
        fields = [
            'first_name',
            'last_name',
            'email',
            'phone',
            'company',
            'subject',
            'message',
            'consent_privacy'
        ]
    
    def validate_consent_privacy(self, value):
        """Ensure privacy consent is given."""
        if not value:
            raise serializers.ValidationError(
                "Vous devez accepter la politique de confidentialité."
            )
        return value
    
    def validate_message(self, value):
        """Validate message length."""
        if len(value.strip()) < 10:
            raise serializers.ValidationError(
                "Le message doit contenir au moins 10 caractères."
            )
        return value.strip()


class ContactMessageDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for contact message detail (admin only).
    """
    subject_display = serializers.CharField(source='get_subject_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    assigned_to_name = serializers.SerializerMethodField()
    
    class Meta:
        model = ContactMessage
        fields = [
            'id',
            'first_name',
            'last_name',
            'email',
            'phone',
            'company',
            'subject',
            'subject_display',
            'message',
            'status',
            'status_display',
            'admin_notes',
            'assigned_to',
            'assigned_to_name',
            'resolved_at',
            'consent_privacy',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_assigned_to_name(self, obj):
        """Get assigned user full name."""
        if obj.assigned_to:
            return f"{obj.assigned_to.first_name} {obj.assigned_to.last_name}"
        return None


class ContactMessageUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating contact message (admin only).
    """
    class Meta:
        model = ContactMessage
        fields = [
            'status',
            'admin_notes',
            'assigned_to'
        ]


class NewsletterSubscribeSerializer(serializers.ModelSerializer):
    """
    Serializer for newsletter subscription.
    """
    class Meta:
        model = NewsletterSubscriber
        fields = [
            'email',
            'first_name',
            'last_name',
            'interests'
        ]
    
    def validate_email(self, value):
        """Check if email is already subscribed."""
        email = value.lower().strip()
        
        # Check if already subscribed and active
        if NewsletterSubscriber.objects.filter(email=email, is_active=True).exists():
            raise serializers.ValidationError(
                "Cet email est déjà inscrit à la newsletter."
            )
        
        return email
    
    def create(self, validated_data):
        """Create or reactivate newsletter subscription."""
        email = validated_data['email']
        
        # Check if subscriber exists but inactive
        try:
            subscriber = NewsletterSubscriber.objects.get(email=email)
            subscriber.is_active = True
            subscriber.first_name = validated_data.get('first_name', '')
            subscriber.last_name = validated_data.get('last_name', '')
            subscriber.interests = validated_data.get('interests', [])
            subscriber.unsubscribed_at = None
            subscriber.save()
            return subscriber
        except NewsletterSubscriber.DoesNotExist:
            # Create new subscriber
            import uuid
            validated_data['verification_token'] = str(uuid.uuid4())
            return super().create(validated_data)


class NewsletterSubscriberDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for newsletter subscriber detail (admin only).
    """
    class Meta:
        model = NewsletterSubscriber
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'is_active',
            'is_verified',
            'interests',
            'consent_date',
            'unsubscribed_at',
            'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'id',
            'consent_date',
            'unsubscribed_at',
            'created_at',
            'updated_at'
        ]
