"""
Serializers for user authentication and management.
"""
from rest_framework import serializers
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model.
    """
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'full_name',
            'role',
            'phone',
            'avatar',
            'is_active',
            'date_joined',
            'last_login',
        ]
        read_only_fields = ['id', 'date_joined', 'last_login']


class UserCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating new users.
    """
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, required=True)
    phone = serializers.CharField(required=True, max_length=20)

    class Meta:
        model = User
        fields = [
            'email',
            'first_name',
            'last_name',
            'phone',
            'password',
            'password_confirm',
            'role',
            'avatar',
        ]

    def validate_phone(self, value):
        """
        Validate that phone number is unique.
        """
        if not value:
            raise serializers.ValidationError('Le numéro de téléphone est requis.')
        
        # Check if phone already exists (excluding soft-deleted users)
        if User.objects.filter(phone=value, is_deleted=False).exists():
            raise serializers.ValidationError('Ce numéro de téléphone est déjà utilisé.')
        
        return value

    def validate(self, attrs):
        """
        Validate that passwords match and phone is provided.
        """
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': 'Les mots de passe ne correspondent pas.'
            })
        
        if not attrs.get('phone'):
            raise serializers.ValidationError({
                'phone': 'Le numéro de téléphone est requis.'
            })
            
        return attrs

    def create(self, validated_data):
        """
        Create a new user with encrypted password.
        """
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        user = User.objects.create_user(
            password=password,
            **validated_data
        )
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating user profile.
    """
    # Override phone field to remove unique validation at serializer level
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True, allow_null=True)
    
    class Meta:
        model = User
        fields = [
            'first_name',
            'last_name',
            'phone',
            'avatar',
            'role',  # Allow admin to update role
        ]
        extra_kwargs = {
            'phone': {'validators': []},  # Remove default validators including unique
        }

    def validate_phone(self, value):
        """
        Validate that phone number is unique (excluding current user).
        """
        if not value:
            return value  # Allow empty phone
        
        # Normalize phone number (remove spaces, special chars except +)
        normalized_value = ''.join(c for c in value if c.isdigit() or c == '+').strip()
        
        # Get the current user being updated
        instance = self.instance
        
        # Get current user's phone (normalized)
        current_phone = instance.phone if instance else None
        if current_phone:
            current_phone_normalized = ''.join(c for c in current_phone if c.isdigit() or c == '+').strip()
        else:
            current_phone_normalized = None
        
        # If the phone hasn't changed, allow it
        if current_phone_normalized and normalized_value == current_phone_normalized:
            return value
        
        # Check if phone already exists for another user (excluding soft-deleted users)
        # Compare normalized versions
        all_users = User.objects.filter(is_deleted=False).exclude(
            pk=instance.pk if instance else None
        )
        
        for user in all_users:
            if user.phone:
                user_phone_normalized = ''.join(c for c in user.phone if c.isdigit() or c == '+').strip()
                if user_phone_normalized == normalized_value:
                    raise serializers.ValidationError(
                        'Ce numéro de téléphone est déjà utilisé par un autre utilisateur. Veuillez en choisir un autre.'
                    )
        
        return value

    def validate_role(self, value):
        """
        Validate role changes - only allow if user is admin.
        """
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            if not request.user.is_admin:
                raise serializers.ValidationError(
                    'Seuls les administrateurs peuvent modifier le rôle.'
                )
        return value


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for changing password.
    """
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, min_length=8)
    new_password_confirm = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        """
        Validate that new passwords match.
        """
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({
                'new_password_confirm': 'Les mots de passe ne correspondent pas.'
            })
        return attrs


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT token serializer that includes user data.
    Accepts 'email' instead of 'username' for authentication.
    Checks if user needs OTP verification or password change AFTER authentication.
    """
    # Override username_field to accept email
    username_field = get_user_model().USERNAME_FIELD  # Utilise le USERNAME_FIELD du modèle User (email)
    
    def validate(self, attrs):
        # Django simple-jwt attend 'username' par défaut
        # On mappe 'email' vers 'username' si nécessaire
        if 'email' in attrs and 'username' not in attrs:
            attrs['username'] = attrs['email']
        
        # First, authenticate the user (this validates credentials)
        try:
            data = super().validate(attrs)
        except Exception as e:
            # If authentication fails, re-raise the error
            raise e
        
        # NOW check if email needs verification or password needs to be changed
        user = self.user
        
        # Check if email needs verification
        if not user.is_email_verified:
            from rest_framework.exceptions import ValidationError as DRFValidationError
            
            # Send OTP email on first login attempt
            from apps.accounts.email_service import send_verification_email
            if user.email_verification_code:
                send_verification_email(user, user.email_verification_code)
            
            error = DRFValidationError('Votre email n\'est pas vérifié.')
            error.detail = {
                'detail': 'Votre email n\'est pas vérifié. Veuillez entrer le code OTP envoyé à votre adresse email.',
                'requires_otp': True,
                'email': user.email
            }
            raise error
        
        # Check if password needs to be changed
        if user.must_change_password:
            from rest_framework.exceptions import ValidationError as DRFValidationError
            error = DRFValidationError('Vous devez changer votre mot de passe.')
            error.detail = {
                'detail': 'Vous devez changer votre mot de passe lors de votre première connexion.',
                'requires_password_change': True,
                'email': user.email
            }
            raise error
        
        # Add user data to the response
        data['user'] = UserSerializer(self.user).data
        
        return data


class ActiveUserTokenRefreshSerializer(TokenRefreshSerializer):
    """
    Token refresh serializer that refuses to renew tokens for accounts that
    have been deactivated.

    SimpleJWT's default refresh flow does not re-check ``is_active``: a
    disabled account could therefore keep refreshing an access token forever,
    even though every authenticated API call would then be rejected with
    ``user_inactive`` (which is exactly what caused an infinite refresh loop
    on the frontend).
    """

    def validate(self, attrs):
        token = RefreshToken(attrs['refresh'])

        try:
            user_id = token[settings.SIMPLE_JWT['USER_ID_CLAIM']]
        except KeyError:
            raise AuthenticationFailed(
                'Token invalide.', code='token_not_valid'
            )

        user = User.objects.filter(pk=user_id).first()

        if user is None or not user.is_active:
            raise AuthenticationFailed(
                'Ce compte a été désactivé. Veuillez contacter un administrateur.',
                code='user_inactive',
            )

        return super().validate(attrs)


class VerifyOTPSerializer(serializers.Serializer):
    """
    Serializer for OTP verification.
    """
    email = serializers.EmailField(required=True)
    code = serializers.CharField(required=True, min_length=6, max_length=6)


class FirstLoginPasswordChangeSerializer(serializers.Serializer):
    """
    Serializer for changing password on first login.
    """
    email = serializers.EmailField(required=True)
    new_password = serializers.CharField(required=True, write_only=True, min_length=8)
    new_password_confirm = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        """
        Validate that new passwords match.
        """
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({
                'new_password_confirm': 'Les mots de passe ne correspondent pas.'
            })
        return attrs



class ForgotPasswordSerializer(serializers.Serializer):
    """
    Serializer for forgot password request.
    """
    email = serializers.EmailField(required=True)


class VerifyResetCodeSerializer(serializers.Serializer):
    """
    Serializer for verifying password reset code.
    """
    email = serializers.EmailField(required=True)
    code = serializers.CharField(required=True, min_length=6, max_length=6)


class ResetPasswordSerializer(serializers.Serializer):
    """
    Serializer for resetting password with code.
    """
    email = serializers.EmailField(required=True)
    code = serializers.CharField(required=True, min_length=6, max_length=6)
    new_password = serializers.CharField(required=True, write_only=True, min_length=8)
    new_password_confirm = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        """
        Validate that new passwords match.
        """
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({
                'new_password_confirm': 'Les mots de passe ne correspondent pas.'
            })
        return attrs
