"""
Views for notifications.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from apps.core.permissions import IsAdminUser
from .models import Notification
from .serializers import NotificationSerializer, UnreadCountSerializer
from .services import NotificationService


class NotificationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for notifications management by authenticated users.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_read', 'type']
    search_fields = ['title', 'message']
    ordering_fields = ['created_at', 'is_read']
    ordering = ['-created_at']
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']

    def get_queryset(self):
        """
        Admins only see notifications directed to their account.
        """
        user = self.request.user
        if not user or not user.is_authenticated:
            return Notification.objects.none()
        return Notification.objects.filter(recipient=user)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'message': 'Notifications récupérées avec succès',
            'data': serializer.data
        })

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            'success': True,
            'data': serializer.data
        })

    @action(detail=False, methods=['get'], url_path='unread-count')
    def unread_count(self, request):
        """
        Returns the number of unread notifications for current user.
        GET /api/v1/notifications/unread-count/
        """
        count = NotificationService.get_unread_count(request.user)
        return Response({
            'success': True,
            'unread_count': count
        })

    @action(detail=True, methods=['post'], url_path='mark-read')
    def mark_read(self, request, pk=None):
        """
        Marks a specific notification as read.
        POST /api/v1/notifications/{id}/mark-read/
        """
        notification = self.get_object()
        notification.mark_as_read()
        serializer = self.get_serializer(notification)
        return Response({
            'success': True,
            'message': 'Notification marquée comme lue',
            'data': serializer.data
        })

    @action(detail=True, methods=['post'], url_path='mark-unread')
    def mark_unread(self, request, pk=None):
        """
        Marks a specific notification as unread.
        POST /api/v1/notifications/{id}/mark-unread/
        """
        notification = self.get_object()
        notification.mark_as_unread()
        serializer = self.get_serializer(notification)
        return Response({
            'success': True,
            'message': 'Notification marquée comme non lue',
            'data': serializer.data
        })

    @action(detail=False, methods=['post'], url_path='mark-all-read')
    def mark_all_read(self, request):
        """
        Marks all notifications of current user as read.
        POST /api/v1/notifications/mark-all-read/
        """
        updated_count = NotificationService.mark_all_as_read(request.user)
        return Response({
            'success': True,
            'message': f'{updated_count} notification(s) marquée(s) comme lue(s)',
            'updated_count': updated_count
        })

    @action(detail=False, methods=['delete'], url_path='clear-all-read')
    def clear_all_read(self, request):
        """
        Deletes all read notifications for current user.
        DELETE /api/v1/notifications/clear-all-read/
        """
        deleted_count = NotificationService.clear_all_read(request.user)
        return Response({
            'success': True,
            'message': f'{deleted_count} notification(s) supprimée(s)',
            'deleted_count': deleted_count
        })

    @action(detail=False, methods=['post'], url_path='broadcast', permission_classes=[IsAuthenticated, IsAdminUser])
    def broadcast(self, request):
        """
        Diffuser un message de masse aux utilisateurs ciblés.
        POST /api/v1/notifications/broadcast/
        """
        data = request.data
        title = data.get('title', '').strip()
        message = data.get('message', '').strip()
        target_type = data.get('target_type', 'ALL').upper()
        roles = data.get('roles', [])
        user_ids = data.get('user_ids', [])
        link = data.get('link', '').strip()
        priority = data.get('priority', 'NORMAL')

        if not title:
            return Response({
                'success': False,
                'message': 'Le titre du message est obligatoire.'
            }, status=status.HTTP_400_BAD_REQUEST)

        if not message:
            return Response({
                'success': False,
                'message': 'Le contenu du message est obligatoire.'
            }, status=status.HTTP_400_BAD_REQUEST)

        if target_type not in ['ALL', 'ROLE', 'CUSTOM']:
            return Response({
                'success': False,
                'message': 'Type de cible invalide (ALL, ROLE ou CUSTOM requis).'
            }, status=status.HTTP_400_BAD_REQUEST)

        notifications = NotificationService.broadcast_message(
            sender=request.user,
            target_type=target_type,
            roles=roles,
            user_ids=user_ids,
            title=title,
            message=message,
            link=link,
            priority=priority
        )

        return Response({
            'success': True,
            'message': f'Message diffusé avec succès à {len(notifications)} utilisateur(s).',
            'recipients_count': len(notifications)
        }, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({
            'success': True,
            'message': 'Notification supprimée avec succès'
        }, status=status.HTTP_200_OK)
