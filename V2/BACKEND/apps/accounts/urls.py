"""
URL configuration for accounts app.
"""
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    CustomTokenObtainPairView,
    logout_view,
    me_view,
    update_profile_view,
    change_password_view,
    create_user_view,
    list_users_view,
)

app_name = 'accounts'

urlpatterns = [
    # Authentication
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', logout_view, name='logout'),
    
    # Profile
    path('me/', me_view, name='me'),
    path('me/update/', update_profile_view, name='update_profile'),
    path('me/change-password/', change_password_view, name='change_password'),
    
    # User management (admin)
    path('users/', list_users_view, name='list_users'),
    path('users/create/', create_user_view, name='create_user'),
]
