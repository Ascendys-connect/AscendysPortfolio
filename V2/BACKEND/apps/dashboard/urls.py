"""
URL configuration for dashboard app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ActivityLogViewSet, dashboard_stats, dashboard_charts

app_name = 'dashboard'

router = DefaultRouter()
router.register(r'activity-logs', ActivityLogViewSet, basename='activity-log')

urlpatterns = [
    path('', include(router.urls)),
    path('stats/', dashboard_stats, name='dashboard-stats'),
    path('charts/', dashboard_charts, name='dashboard-charts'),
]
