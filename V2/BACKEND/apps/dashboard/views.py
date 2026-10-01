"""
Views for dashboard and activity logs.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta

from apps.core.permissions import IsAdminUser
from .models import ActivityLog
from .serializers import ActivityLogSerializer


class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for activity logs.
    
    Admin only - read-only endpoints:
    - list: Get all activity logs
    - retrieve: Get activity log detail
    - clear: Delete all activity logs (POST)
    """
    queryset = ActivityLog.objects.all()
    serializer_class = ActivityLogSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['action', 'user']
    search_fields = ['description', 'user__email', 'user__first_name', 'user__last_name']
    ordering_fields = ['created_at', 'action']
    ordering = ['-created_at']
    
    def list(self, request, *args, **kwargs):
        """
        Override list to add custom response format.
        """
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'message': 'Logs d\'activité récupérés avec succès',
            'data': serializer.data
        })
    
    @action(detail=False, methods=['post'], url_path='clear')
    def clear(self, request):
        """
        Delete all activity logs.
        Only super admins can clear logs.
        """
        if request.user.role != 'SUPER_ADMIN':
            return Response({
                'success': False,
                'message': 'Seuls les super administrateurs peuvent effacer les logs'
            }, status=status.HTTP_403_FORBIDDEN)
        
        count = ActivityLog.objects.count()
        ActivityLog.objects.all().delete()
        
        return Response({
            'success': True,
            'message': f'{count} log(s) d\'activité supprimé(s) avec succès'
        }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def dashboard_stats(request):
    """
    Get dashboard statistics.
    Admin only.
    """
    from apps.trainings.models import Training
    from apps.blog.models import BlogPost
    from apps.events.models import Event
    from apps.contact.models import ContactMessage, NewsletterSubscriber
    from apps.testimonials.models import Testimonial
    from apps.partners.models import Partner
    from apps.accounts.models import User
    
    # Calculate date ranges
    today = timezone.now()
    last_7_days = today - timedelta(days=7)
    last_30_days = today - timedelta(days=30)
    
    stats = {
        # Content statistics
        'trainings': {
            'total': Training.objects.count(),
            'published': Training.objects.filter(status='PUBLISHED').count(),
            'draft': Training.objects.filter(status='DRAFT').count(),
        },
        'blog_posts': {
            'total': BlogPost.objects.count(),
            'published': BlogPost.objects.filter(status='PUBLISHED').count(),
            'draft': BlogPost.objects.filter(status='DRAFT').count(),
        },
        'events': {
            'total': Event.objects.count(),
            'upcoming': Event.objects.filter(
                status='UPCOMING',
                start_datetime__gte=today
            ).count(),
            'past': Event.objects.filter(
                status='COMPLETED'
            ).count(),
        },
        
        # User engagement
        'contact_messages': {
            'total': ContactMessage.objects.count(),
            'new': ContactMessage.objects.filter(status='NEW').count(),
            'last_7_days': ContactMessage.objects.filter(
                created_at__gte=last_7_days
            ).count(),
        },
        'newsletter_subscribers': {
            'total': NewsletterSubscriber.objects.count(),
            'active': NewsletterSubscriber.objects.filter(is_active=True).count(),
            'last_30_days': NewsletterSubscriber.objects.filter(
                created_at__gte=last_30_days
            ).count(),
        },
        
        # Social proof
        'testimonials': {
            'total': Testimonial.objects.count(),
            'published': Testimonial.objects.filter(is_published=True).count(),
        },
        'partners': {
            'total': Partner.objects.count(),
            'active': Partner.objects.filter(is_active=True).count(),
        },
        
        # Users
        'users': {
            'total': User.objects.count(),
            'admins': User.objects.filter(role='ADMIN').count(),
            'super_admins': User.objects.filter(role='SUPER_ADMIN').count(),
        },
        
        # Recent activity
        'recent_activities': {
            'last_7_days': ActivityLog.objects.filter(
                created_at__gte=last_7_days
            ).count(),
            'last_30_days': ActivityLog.objects.filter(
                created_at__gte=last_30_days
            ).count(),
        }
    }
    
    return Response({
        'success': True,
        'message': 'Statistiques du dashboard récupérées avec succès',
        'data': stats
    })


@api_view(['GET'])
@permission_classes([IsAdminUser])
def dashboard_charts(request):
    """
    Get data for dashboard charts.
    Admin only.
    """
    from apps.contact.models import ContactMessage
    from apps.blog.models import BlogPost
    from apps.trainings.models import Training
    
    today = timezone.now()
    last_30_days = today - timedelta(days=30)
    
    # Contact messages by status
    messages_by_status = dict(
        ContactMessage.objects.values('status').annotate(
            count=Count('id')
        ).values_list('status', 'count')
    )
    
    # Blog posts views over time (last 30 days)
    # Training enrollments over time
    # etc.
    
    charts = {
        'contact_messages_by_status': messages_by_status,
        'activity_by_day': _get_activity_by_day(last_30_days, today),
        'content_by_type': {
            'blog_posts': BlogPost.objects.filter(status='PUBLISHED').count(),
            'trainings': Training.objects.filter(status='PUBLISHED').count(),
        }
    }
    
    return Response({
        'success': True,
        'message': 'Données des graphiques récupérées avec succès',
        'data': charts
    })


def _get_activity_by_day(start_date, end_date):
    """
    Get activity count by day for the given period.
    """
    from django.db.models.functions import TruncDate
    
    activities = ActivityLog.objects.filter(
        created_at__gte=start_date,
        created_at__lte=end_date
    ).annotate(
        date=TruncDate('created_at')
    ).values('date').annotate(
        count=Count('id')
    ).order_by('date')
    
    return {str(item['date']): item['count'] for item in activities}
