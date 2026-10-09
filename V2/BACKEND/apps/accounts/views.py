"""
Views for user authentication and management.
"""
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema, OpenApiResponse

from apps.core.exceptions import api_response
from apps.core.permissions import IsAdminUser
from .serializers import (
    UserSerializer,
    UserCreateSerializer,
    UserUpdateSerializer,
    ChangePasswordSerializer,
    CustomTokenObtainPairSerializer,
    VerifyOTPSerializer,
    FirstLoginPasswordChangeSerializer,
    ForgotPasswordSerializer,
    VerifyResetCodeSerializer,
    ResetPasswordSerializer,
)
from .email_service import send_verification_email, send_password_changed_email

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom login view that returns JWT tokens and user data.
    """
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            try:
                from apps.dashboard.models import ActivityLog
                from apps.core.middleware import RequestLoggingMiddleware
                # Retrieve the user from the validated serializer
                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=False)
                user = serializer.user if hasattr(serializer, 'user') and serializer.user else None
                if user:
                    ActivityLog.log_activity(
                        user=user,
                        action='LOGIN',
                        description=f'Connexion de {user.get_full_name() or user.email}',
                        ip_address=RequestLoggingMiddleware.get_client_ip(request),
                        user_agent=request.META.get('HTTP_USER_AGENT', ''),
                        metadata={'path': request.path},
                    )
            except Exception:
                pass
        return response


@extend_schema(
    summary="Déconnexion",
    description="Déconnexion de l'utilisateur (blacklist le refresh token)",
    request=None,
    responses={
        200: OpenApiResponse(description="Déconnexion réussie"),
        400: OpenApiResponse(description="Erreur lors de la déconnexion"),
    }
)
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    """
    Logout the user by blacklisting the refresh token.
    """
    try:
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()

        # Log the logout
        try:
            from apps.dashboard.models import ActivityLog
            from apps.core.middleware import RequestLoggingMiddleware
            ActivityLog.log_activity(
                user=request.user,
                action='LOGOUT',
                description=f'Déconnexion de {request.user.get_full_name() or request.user.email}',
                ip_address=RequestLoggingMiddleware.get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                metadata={'path': request.path},
            )
        except Exception:
            pass

        return api_response(
            success=True,
            message='Déconnexion réussie.',
            status_code=status.HTTP_200_OK
        )
    except Exception as e:
        return api_response(
            success=False,
            message='Erreur lors de la déconnexion.',
            errors={'detail': str(e)},
            status_code=status.HTTP_400_BAD_REQUEST
        )


@extend_schema(
    summary="Profil utilisateur",
    description="Récupère les informations du profil de l'utilisateur connecté",
    responses={
        200: UserSerializer,
    }
)
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def me_view(request):
    """
    Get current user profile.
    """
    serializer = UserSerializer(request.user)
    return api_response(
        success=True,
        message='Profil récupéré avec succès.',
        data=serializer.data,
        status_code=status.HTTP_200_OK
    )


@extend_schema(
    summary="Mettre à jour le profil",
    description="Met à jour les informations du profil de l'utilisateur connecté",
    request=UserUpdateSerializer,
    responses={
        200: UserSerializer,
        400: OpenApiResponse(description="Données invalides"),
    }
)
@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_profile_view(request):
    """
    Update current user profile.
    """
    serializer = UserUpdateSerializer(
        request.user, 
        data=request.data, 
        partial=True,
        context={'request': request}
    )
    
    if serializer.is_valid():
        try:
            serializer.save()
            return api_response(
                success=True,
                message='Profil mis à jour avec succès.',
                data=UserSerializer(request.user).data,
                status_code=status.HTTP_200_OK
            )
        except Exception as e:
            # Handle database IntegrityError for duplicate phone
            error_message = str(e)
            if 'phone' in error_message.lower() or 'accounts_user_phone' in error_message:
                return api_response(
                    success=False,
                    message='Ce numéro de téléphone est déjà utilisé.',
                    errors={'phone': ['Ce numéro de téléphone est déjà utilisé par un autre utilisateur. Veuillez en choisir un autre.']},
                    status_code=status.HTTP_400_BAD_REQUEST
                )
            else:
                # Re-raise other exceptions
                raise
    
    return api_response(
        success=False,
        message='Erreur lors de la mise à jour du profil.',
        errors=serializer.errors,
        status_code=status.HTTP_400_BAD_REQUEST
    )


@extend_schema(
    summary="Changer le mot de passe",
    description="Change le mot de passe de l'utilisateur connecté",
    request=ChangePasswordSerializer,
    responses={
        200: OpenApiResponse(description="Mot de passe changé avec succès"),
        400: OpenApiResponse(description="Données invalides ou ancien mot de passe incorrect"),
    }
)
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def change_password_view(request):
    """
    Change user password.
    """
    serializer = ChangePasswordSerializer(data=request.data)
    
    if serializer.is_valid():
        user = request.user
        
        # Check old password
        if not user.check_password(serializer.validated_data['old_password']):
            return api_response(
                success=False,
                message='Ancien mot de passe incorrect.',
                errors={'old_password': 'Le mot de passe actuel est incorrect.'},
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        # Set new password
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return api_response(
            success=True,
            message='Mot de passe changé avec succès.',
            status_code=status.HTTP_200_OK
        )
    
    return api_response(
        success=False,
        message='Erreur lors du changement de mot de passe.',
        errors=serializer.errors,
        status_code=status.HTTP_400_BAD_REQUEST
    )


@extend_schema(
    summary="Créer un utilisateur (Admin)",
    description="Crée un nouvel utilisateur (réservé aux administrateurs). Un code OTP est envoyé à l'email de l'utilisateur.",
    request=UserCreateSerializer,
    responses={
        201: UserSerializer,
        400: OpenApiResponse(description="Données invalides"),
        403: OpenApiResponse(description="Permission refusée"),
    }
)
@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_user_view(request):
    """
    Create a new user (admin only).
    Generates OTP code but doesn't send it yet (will be sent on first login attempt).
    """
    serializer = UserCreateSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        
        # Generate OTP code (but don't send email yet - will be sent on first login)
        user.generate_verification_code()
        
        return api_response(
            success=True,
            message='Utilisateur créé avec succès. Un code de vérification sera envoyé lors de sa première connexion.',
            data=UserSerializer(user).data,
            status_code=status.HTTP_201_CREATED
        )
    
    return api_response(
        success=False,
        message='Erreur lors de la création de l\'utilisateur.',
        errors=serializer.errors,
        status_code=status.HTTP_400_BAD_REQUEST
    )


@extend_schema(
    summary="Liste des utilisateurs (Admin)",
    description="Liste tous les utilisateurs non supprimés (réservé aux administrateurs)",
    responses={
        200: UserSerializer(many=True),
        403: OpenApiResponse(description="Permission refusée"),
    }
)
@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_users_view(request):
    """
    List all non-deleted users (admin only).
    """
    users = User.objects.filter(is_deleted=False)
    serializer = UserSerializer(users, many=True)
    
    return api_response(
        success=True,
        message='Liste des utilisateurs récupérée avec succès.',
        data=serializer.data,
        status_code=status.HTTP_200_OK
    )


@extend_schema(
    summary="Mettre à jour un utilisateur (Admin)",
    description="Met à jour le rôle d'un utilisateur (réservé aux administrateurs)",
    request=UserUpdateSerializer,
    responses={
        200: UserSerializer,
        400: OpenApiResponse(description="Données invalides"),
        403: OpenApiResponse(description="Permission refusée"),
        404: OpenApiResponse(description="Utilisateur non trouvé"),
    }
)
@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def update_user_view(request, user_id):
    """
    Update user role (admin only).
    """
    try:
        user = User.objects.get(id=user_id, is_deleted=False)
    except User.DoesNotExist:
        return api_response(
            success=False,
            message='Utilisateur non trouvé.',
            status_code=status.HTTP_404_NOT_FOUND
        )
    
    serializer = UserUpdateSerializer(user, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return api_response(
            success=True,
            message='Utilisateur mis à jour avec succès.',
            data=UserSerializer(user).data,
            status_code=status.HTTP_200_OK
        )
    
    return api_response(
        success=False,
        message='Erreur lors de la mise à jour de l\'utilisateur.',
        errors=serializer.errors,
        status_code=status.HTTP_400_BAD_REQUEST
    )


@extend_schema(
    summary="Suspendre/Activer un utilisateur (Admin)",
    description="Suspend ou active un utilisateur (réservé aux administrateurs). Protection: ne peut pas suspendre le dernier SUPER_ADMIN actif.",
    responses={
        200: UserSerializer,
        400: OpenApiResponse(description="Opération interdite"),
        403: OpenApiResponse(description="Permission refusée"),
        404: OpenApiResponse(description="Utilisateur non trouvé"),
    }
)
@api_view(['POST'])
@permission_classes([IsAdminUser])
def toggle_user_status_view(request, user_id):
    """
    Toggle user active status (admin only).
    Protection: Cannot suspend the last active SUPER_ADMIN.
    """
    try:
        user = User.objects.get(id=user_id, is_deleted=False)
    except User.DoesNotExist:
        return api_response(
            success=False,
            message='Utilisateur non trouvé.',
            status_code=status.HTTP_404_NOT_FOUND
        )
    
    # Protection: Check if trying to suspend a SUPER_ADMIN
    if user.role == 'SUPER_ADMIN' and user.is_active:
        # Count other active SUPER_ADMINs
        other_active_super_admins = User.objects.filter(
            role='SUPER_ADMIN',
            is_active=True,
            is_deleted=False
        ).exclude(id=user.id).count()
        
        if other_active_super_admins == 0:
            return api_response(
                success=False,
                message='Impossible de suspendre le dernier SUPER_ADMIN actif. Au moins un SUPER_ADMIN doit rester actif pour éviter le blocage du système.',
                status_code=status.HTTP_400_BAD_REQUEST
            )
    
    # Toggle status
    user.is_active = not user.is_active
    user.save()
    
    action = 'activé' if user.is_active else 'suspendu'
    return api_response(
        success=True,
        message=f'Utilisateur {action} avec succès.',
        data=UserSerializer(user).data,
        status_code=status.HTTP_200_OK
    )


@extend_schema(
    summary="Supprimer un utilisateur (Admin)",
    description="Suppression soft d'un utilisateur (réservé aux administrateurs). Protection: ne peut pas supprimer un SUPER_ADMIN.",
    responses={
        200: OpenApiResponse(description="Utilisateur supprimé avec succès"),
        400: OpenApiResponse(description="Opération interdite"),
        403: OpenApiResponse(description="Permission refusée"),
        404: OpenApiResponse(description="Utilisateur non trouvé"),
    }
)
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_user_view(request, user_id):
    """
    Soft delete a user (admin only).
    Protection: Cannot delete SUPER_ADMIN users.
    """
    try:
        user = User.objects.get(id=user_id, is_deleted=False)
    except User.DoesNotExist:
        return api_response(
            success=False,
            message='Utilisateur non trouvé.',
            status_code=status.HTTP_404_NOT_FOUND
        )
    
    # Protection: Cannot delete SUPER_ADMIN
    if user.role == 'SUPER_ADMIN':
        return api_response(
            success=False,
            message='Impossible de supprimer un SUPER_ADMIN. Cette action est interdite pour des raisons de sécurité.',
            status_code=status.HTTP_400_BAD_REQUEST
        )
    
    # Soft delete
    user.soft_delete()
    
    return api_response(
        success=True,
        message='Utilisateur supprimé avec succès.',
        status_code=status.HTTP_200_OK
    )




@extend_schema(
    summary="Vérifier le code OTP",
    description="Vérifie le code OTP envoyé par email lors de la première connexion",
    request=VerifyOTPSerializer,
    responses={
        200: OpenApiResponse(description="Code vérifié avec succès"),
        400: OpenApiResponse(description="Code invalide ou expiré"),
    }
)
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def verify_otp_view(request):
    """
    Verify OTP code for first login.
    """
    serializer = VerifyOTPSerializer(data=request.data)
    
    if serializer.is_valid():
        email = serializer.validated_data['email']
        code = serializer.validated_data['code']
        
        try:
            user = User.objects.get(email=email, is_deleted=False)
        except User.DoesNotExist:
            return api_response(
                success=False,
                message='Utilisateur non trouvé.',
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        if user.verify_code(code):
            return api_response(
                success=True,
                message='Code vérifié avec succès. Veuillez maintenant changer votre mot de passe.',
                data={'email_verified': True, 'must_change_password': user.must_change_password},
                status_code=status.HTTP_200_OK
            )
        else:
            return api_response(
                success=False,
                message='Code invalide ou expiré.',
                status_code=status.HTTP_400_BAD_REQUEST
            )
    
    return api_response(
        success=False,
        message='Données invalides.',
        errors=serializer.errors,
        status_code=status.HTTP_400_BAD_REQUEST
    )


@extend_schema(
    summary="Renvoyer le code OTP",
    description="Renvoie un nouveau code OTP à l'adresse email de l'utilisateur",
    request={'email': 'email@example.com'},
    responses={
        200: OpenApiResponse(description="Code renvoyé avec succès"),
        404: OpenApiResponse(description="Utilisateur non trouvé"),
    }
)
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def resend_otp_view(request):
    """
    Resend OTP code to user's email.
    Limited to 3 resends per verification session.
    """
    email = request.data.get('email')
    
    if not email:
        return api_response(
            success=False,
            message='Email requis.',
            status_code=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = User.objects.get(email=email, is_deleted=False)
    except User.DoesNotExist:
        return api_response(
            success=False,
            message='Utilisateur non trouvé.',
            status_code=status.HTTP_404_NOT_FOUND
        )
    
    if user.is_email_verified:
        return api_response(
            success=False,
            message='Email déjà vérifié.',
            status_code=status.HTTP_400_BAD_REQUEST
        )
    
    # Check resend limit (max 3 times)
    if user.email_verification_resend_count >= 3:
        return api_response(
            success=False,
            message='Limite de renvoi atteinte. Veuillez contacter l\'administrateur.',
            status_code=status.HTTP_429_TOO_MANY_REQUESTS
        )
    
    # Regenerate OTP code (keeps same expiration window but generates new code)
    import random
    code = ''.join([str(random.randint(0, 9)) for _ in range(6)])
    user.email_verification_code = code
    user.email_verification_code_expires = timezone.now() + timezone.timedelta(minutes=15)
    user.email_verification_resend_count += 1
    user.save()
    
    send_verification_email(user, code)
    
    remaining = 3 - user.email_verification_resend_count
    return api_response(
        success=True,
        message=f'Un nouveau code de vérification a été envoyé à votre adresse email. ({remaining} renvoi(s) restant(s))',
        data={'remaining_resends': remaining},
        status_code=status.HTTP_200_OK
    )


@extend_schema(
    summary="Changer le mot de passe (première connexion)",
    description="Change le mot de passe lors de la première connexion (après vérification OTP) et connecte automatiquement l'utilisateur",
    request=FirstLoginPasswordChangeSerializer,
    responses={
        200: OpenApiResponse(description="Mot de passe changé avec succès, utilisateur connecté"),
        400: OpenApiResponse(description="Données invalides"),
    }
)
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def first_login_password_change_view(request):
    """
    Change password on first login (after OTP verification) and auto-login user.
    """
    serializer = FirstLoginPasswordChangeSerializer(data=request.data)
    
    if serializer.is_valid():
        email = serializer.validated_data['email']
        new_password = serializer.validated_data['new_password']
        
        try:
            user = User.objects.get(email=email, is_deleted=False)
        except User.DoesNotExist:
            return api_response(
                success=False,
                message='Utilisateur non trouvé.',
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        # Check if email is verified
        if not user.is_email_verified:
            return api_response(
                success=False,
                message='Veuillez d\'abord vérifier votre email.',
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        # Set new password
        user.set_password(new_password)
        user.must_change_password = False
        user.save()
        
        # Send notification email
        send_password_changed_email(user)
        
        # Generate JWT tokens for auto-login
        refresh = RefreshToken.for_user(user)
        
        return api_response(
            success=True,
            message='Mot de passe changé avec succès. Vous êtes maintenant connecté.',
            data={
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data
            },
            status_code=status.HTTP_200_OK
        )
    
    return api_response(
        success=False,
        message='Erreur lors du changement de mot de passe.',
        errors=serializer.errors,
        status_code=status.HTTP_400_BAD_REQUEST
    )



@extend_schema(
    summary="Mot de passe oublié - Demande de code",
    description="Envoie un code OTP à l'email de l'utilisateur pour réinitialiser son mot de passe",
    request=ForgotPasswordSerializer,
    responses={
        200: OpenApiResponse(description="Code envoyé"),
        404: OpenApiResponse(description="Email non trouvé"),
    }
)
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def forgot_password_view(request):
    """
    Send password reset code to user's email.
    """
    serializer = ForgotPasswordSerializer(data=request.data)
    
    if serializer.is_valid():
        email = serializer.validated_data['email']
        
        try:
            user = User.objects.get(email=email, is_deleted=False, is_active=True)
        except User.DoesNotExist:
            # Don't reveal if email exists or not for security
            return api_response(
                success=True,
                message='Si un compte existe avec cet email, un code de réinitialisation a été envoyé.',
                status_code=status.HTTP_200_OK
            )
        
        # Generate and send reset code
        code = user.generate_password_reset_code()
        from .email_service import send_password_reset_email
        send_password_reset_email(user, code)
        
        return api_response(
            success=True,
            message='Un code de réinitialisation a été envoyé à votre adresse email.',
            status_code=status.HTTP_200_OK
        )
    
    return api_response(
        success=False,
        message='Email invalide.',
        errors=serializer.errors,
        status_code=status.HTTP_400_BAD_REQUEST
    )


@extend_schema(
    summary="Vérifier le code de réinitialisation",
    description="Vérifie que le code OTP de réinitialisation est valide",
    request=VerifyResetCodeSerializer,
    responses={
        200: OpenApiResponse(description="Code valide"),
        400: OpenApiResponse(description="Code invalide ou expiré"),
    }
)
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def verify_reset_code_view(request):
    """
    Verify password reset code.
    """
    serializer = VerifyResetCodeSerializer(data=request.data)
    
    if serializer.is_valid():
        email = serializer.validated_data['email']
        code = serializer.validated_data['code']
        
        try:
            user = User.objects.get(email=email, is_deleted=False)
        except User.DoesNotExist:
            return api_response(
                success=False,
                message='Utilisateur non trouvé.',
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        if user.verify_password_reset_code(code):
            return api_response(
                success=True,
                message='Code valide.',
                status_code=status.HTTP_200_OK
            )
        else:
            return api_response(
                success=False,
                message='Code invalide ou expiré.',
                status_code=status.HTTP_400_BAD_REQUEST
            )
    
    return api_response(
        success=False,
        message='Données invalides.',
        errors=serializer.errors,
        status_code=status.HTTP_400_BAD_REQUEST
    )


@extend_schema(
    summary="Réinitialiser le mot de passe",
    description="Réinitialise le mot de passe avec le code OTP",
    request=ResetPasswordSerializer,
    responses={
        200: OpenApiResponse(description="Mot de passe réinitialisé"),
        400: OpenApiResponse(description="Code invalide"),
    }
)
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def reset_password_view(request):
    """
    Reset password with verification code.
    """
    serializer = ResetPasswordSerializer(data=request.data)
    
    if serializer.is_valid():
        email = serializer.validated_data['email']
        code = serializer.validated_data['code']
        new_password = serializer.validated_data['new_password']
        
        try:
            user = User.objects.get(email=email, is_deleted=False)
        except User.DoesNotExist:
            return api_response(
                success=False,
                message='Utilisateur non trouvé.',
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        if user.reset_password_with_code(code, new_password):
            # Send confirmation email
            send_password_changed_email(user)
            
            return api_response(
                success=True,
                message='Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.',
                status_code=status.HTTP_200_OK
            )
        else:
            return api_response(
                success=False,
                message='Code invalide ou expiré.',
                status_code=status.HTTP_400_BAD_REQUEST
            )
    
    return api_response(
        success=False,
        message='Erreur lors de la réinitialisation.',
        errors=serializer.errors,
        status_code=status.HTTP_400_BAD_REQUEST
    )


@extend_schema(
    summary="Renvoyer le code de réinitialisation",
    description="Renvoie un nouveau code de réinitialisation (max 3 fois)",
    request=ForgotPasswordSerializer,
    responses={
        200: OpenApiResponse(description="Code renvoyé"),
        429: OpenApiResponse(description="Limite atteinte"),
    }
)
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def resend_reset_code_view(request):
    """
    Resend password reset code (limited to 3 times).
    """
    email = request.data.get('email')
    
    if not email:
        return api_response(
            success=False,
            message='Email requis.',
            status_code=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = User.objects.get(email=email, is_deleted=False)
    except User.DoesNotExist:
        return api_response(
            success=True,
            message='Si un compte existe avec cet email, un code a été renvoyé.',
            status_code=status.HTTP_200_OK
        )
    
    # Check resend limit
    if user.password_reset_resend_count >= 3:
        return api_response(
            success=False,
            message='Limite de renvoi atteinte. Veuillez réessayer plus tard.',
            status_code=status.HTTP_429_TOO_MANY_REQUESTS
        )
    
    # Regenerate and resend code
    import random
    code = ''.join([str(random.randint(0, 9)) for _ in range(6)])
    user.password_reset_code = code
    user.password_reset_code_expires = timezone.now() + timezone.timedelta(minutes=15)
    user.password_reset_resend_count += 1
    user.save()
    
    from .email_service import send_password_reset_email
    send_password_reset_email(user, code)
    
    remaining = 3 - user.password_reset_resend_count
    return api_response(
        success=True,
        message=f'Un nouveau code a été envoyé. ({remaining} renvoi(s) restant(s))',
        data={'remaining_resends': remaining},
        status_code=status.HTTP_200_OK
    )
