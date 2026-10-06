"""
Views for Company information.
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from drf_spectacular.utils import extend_schema, OpenApiResponse

from apps.core.exceptions import api_response
from apps.core.permissions import IsAdminUser
from .models import Company
from .serializers import (
    CompanySerializer,
    CompanyUpdateSerializer,
    CompanyAboutSerializer,
)


@extend_schema(
    summary="Informations de l'entreprise",
    description="Récupère toutes les informations de l'entreprise",
    responses={
        200: CompanySerializer,
    }
)
@api_view(['GET'])
@permission_classes([AllowAny])
def company_detail_view(request):
    """
    Get company information (public).
    """
    company = Company.get_instance()
    serializer = CompanySerializer(company)
    
    return api_response(
        success=True,
        message='Informations de l\'entreprise récupérées avec succès.',
        data=serializer.data,
        status_code=status.HTTP_200_OK
    )


@extend_schema(
    summary="Page À propos",
    description="Récupère les informations pour la page À propos",
    responses={
        200: CompanyAboutSerializer,
    }
)
@api_view(['GET'])
@permission_classes([AllowAny])
def company_about_view(request):
    """
    Get company 'About' information (public).
    """
    company = Company.get_instance()
    serializer = CompanyAboutSerializer(company)
    
    return api_response(
        success=True,
        message='Informations À propos récupérées avec succès.',
        data=serializer.data,
        status_code=status.HTTP_200_OK
    )


@extend_schema(
    summary="Mettre à jour l'entreprise (Admin)",
    description="Met à jour les informations de l'entreprise (réservé aux administrateurs)",
    request=CompanyUpdateSerializer,
    responses={
        200: CompanySerializer,
        400: OpenApiResponse(description="Données invalides"),
        403: OpenApiResponse(description="Permission refusée"),
    }
)
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAdminUser])
def company_update_view(request):
    """
    Update company information (admin only).
    """
    company = Company.get_instance()
    partial = request.method == 'PATCH'
    
    serializer = CompanyUpdateSerializer(
        company,
        data=request.data,
        partial=partial,
        context={'request': request}
    )
    
    if serializer.is_valid():
        serializer.save()
        return api_response(
            success=True,
            message='Informations de l\'entreprise mises à jour avec succès.',
            data=CompanySerializer(company).data,
            status_code=status.HTTP_200_OK
        )
    
    return api_response(
        success=False,
        message='Erreur lors de la mise à jour des informations.',
        errors=serializer.errors,
        status_code=status.HTTP_400_BAD_REQUEST
    )
