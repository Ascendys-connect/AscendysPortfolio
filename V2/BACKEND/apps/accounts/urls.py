"""
URL configuration for accounts app.
"""
from django.urls import path

from .views import (
    CustomTokenObtainPairView,
    ActiveUserTokenRefreshView,
    logout_view,
    me_view,
    update_profile_view,
    change_password_view,
    create_user_view,
    list_users_view,
    update_user_view,
    toggle_user_status_view,
    delete_user_view,
    verify_otp_view,
    resend_otp_view,
    first_login_password_change_view,
    forgot_password_view,
    verify_reset_code_view,
    reset_password_view,
    resend_reset_code_view,
)

app_name = 'accounts'

urlpatterns = [
    # Authentication
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('refresh/', ActiveUserTokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', logout_view, name='logout'),
    
    # OTP verification and first login
    path('verify-otp/', verify_otp_view, name='verify_otp'),
    path('resend-otp/', resend_otp_view, name='resend_otp'),
    path('first-login-password-change/', first_login_password_change_view, name='first_login_password_change'),
    
    # Profile
    path('me/', me_view, name='me'),
    path('me/update/', update_profile_view, name='update_profile'),
    path('me/change-password/', change_password_view, name='change_password'),
    
    # User management (admin)
    path('users/', list_users_view, name='list_users'),
    path('users/create/', create_user_view, name='create_user'),
    path('users/<uuid:user_id>/', update_user_view, name='update_user'),
    path('users/<uuid:user_id>/toggle-status/', toggle_user_status_view, name='toggle_user_status'),
    path('users/<uuid:user_id>/delete/', delete_user_view, name='delete_user'),
    
    # Password Reset
    path('forgot-password/', forgot_password_view, name='forgot_password'),
    path('verify-reset-code/', verify_reset_code_view, name='verify_reset_code'),
    path('reset-password/', reset_password_view, name='reset_password'),
    path('resend-reset-code/', resend_reset_code_view, name='resend_reset_code'),
]
