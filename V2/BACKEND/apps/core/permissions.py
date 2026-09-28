"""
Custom permissions for the API.
"""
from rest_framework import permissions
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle


class IsAdminUser(permissions.BasePermission):
    """
    Permission to check if user is Admin or Super Admin.
    """
    message = "Vous devez être administrateur pour effectuer cette action."
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['ADMIN', 'SUPER_ADMIN']
        )


class IsSuperAdminUser(permissions.BasePermission):
    """
    Permission to check if user is Super Admin.
    """
    message = "Vous devez être super administrateur pour effectuer cette action."
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'SUPER_ADMIN'
        )


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permission that allows read-only access to everyone,
    but write access only to Admin users.
    """
    message = "Vous devez être administrateur pour modifier ce contenu."
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['ADMIN', 'SUPER_ADMIN']
        )


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permission that allows owners to edit their own objects,
    and admins to edit any object.
    """
    message = "Vous ne pouvez modifier que votre propre contenu."
    
    def has_object_permission(self, request, view, obj):
        # Read permissions for everyone
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Admin can do anything
        if request.user.role in ['ADMIN', 'SUPER_ADMIN']:
            return True
        
        # Owner can edit their own content
        if hasattr(obj, 'created_by'):
            return obj.created_by == request.user
        elif hasattr(obj, 'user'):
            return obj.user == request.user
        elif hasattr(obj, 'author'):
            return obj.author == request.user
        
        return False


# Throttling Classes
class BurstRateThrottle(UserRateThrottle):
    """
    Burst rate: 60 requests per minute for authenticated users.
    """
    scope = 'burst'
    rate = '60/min'


class SustainedRateThrottle(UserRateThrottle):
    """
    Sustained rate: 1000 requests per day for authenticated users.
    """
    scope = 'sustained'
    rate = '1000/day'


class AnonBurstRateThrottle(AnonRateThrottle):
    """
    Burst rate for anonymous users: 20 requests per minute.
    """
    scope = 'anon_burst'
    rate = '20/min'


class AnonSustainedRateThrottle(AnonRateThrottle):
    """
    Sustained rate for anonymous users: 100 requests per day.
    """
    scope = 'anon_sustained'
    rate = '100/day'


class ContactFormThrottle(AnonRateThrottle):
    """
    Special throttle for contact form: 5 submissions per hour.
    """
    scope = 'contact_form'
    rate = '5/hour'


class NewsletterThrottle(AnonRateThrottle):
    """
    Special throttle for newsletter: 3 submissions per hour.
    """
    scope = 'newsletter'
    rate = '3/hour'
