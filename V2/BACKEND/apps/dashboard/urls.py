"""
URL configuration for dashboard app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ActivityLogViewSet, dashboard_stats, dashboard_charts, global_analytics, editor_stats

app_name = 'dashboard'

router = DefaultRouter()
router.register(r'activity-logs', ActivityLogViewSet, basename='activity-log')

urlpatterns = [
    path('', include(router.urls)),
    path('stats/', dashboard_stats, name='dashboard-stats'),
    path('charts/', dashboard_charts, name='dashboard-charts'),
    path('global-analytics/', global_analytics, name='dashboard-global-analytics'),
    path('editor-stats/', editor_stats, name='editor-stats'),
]
