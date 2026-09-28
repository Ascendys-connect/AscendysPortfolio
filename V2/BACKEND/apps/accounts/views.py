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
)

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom login view that returns JWT tokens and user data.
    """
    serializer_class = CustomTokenObtainPairSerializer


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
    serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return api_response(
            success=True,
            message='Profil mis à jour avec succès.',
            data=UserSerializer(request.user).data,
            status_code=status.HTTP_200_OK
        )
    
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
    description="Crée un nouvel utilisateur (réservé aux administrateurs)",
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
    """
    serializer = UserCreateSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        return api_response(
            success=True,
            message='Utilisateur créé avec succès.',
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
    description="Liste tous les utilisateurs (réservé aux administrateurs)",
    responses={
        200: UserSerializer(many=True),
        403: OpenApiResponse(description="Permission refusée"),
    }
)
@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_users_view(request):
    """
    List all users (admin only).
    """
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    
    return api_response(
        success=True,
        message='Liste des utilisateurs récupérée avec succès.',
        data=serializer.data,
        status_code=status.HTTP_200_OK
    )
