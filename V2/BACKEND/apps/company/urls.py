"""
URL configuration for company app.
"""
from django.urls import path
from .views import (
    company_detail_view,
    company_about_view,
    company_update_view,
)

app_name = 'company'

urlpatterns = [
    path('', company_detail_view, name='detail'),
    path('info/', company_detail_view, name='info'),
    path('about/', company_about_view, name='about'),
    path('update/', company_update_view, name='update'),
]
