"""
Custom middleware for security and logging.
"""
import logging
from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse

logger = logging.getLogger(__name__)


class SecurityHeadersMiddleware(MiddlewareMixin):
    """
    Middleware to add security headers to all responses.
    """
    def process_response(self, request, response):
        # Prevent clickjacking
        response['X-Frame-Options'] = 'DENY'
        
        # XSS Protection
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-XSS-Protection'] = '1; mode=block'
        
        # Referrer Policy
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        
        # Permissions Policy
        response['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'
        
        return response


class RequestLoggingMiddleware(MiddlewareMixin):
    """
    Middleware to log all API requests.
    """
    def process_request(self, request):
        # Log API requests
        if request.path.startswith('/api/'):
            logger.info(
                f"{request.method} {request.path} - "
                f"User: {request.user if request.user.is_authenticated else 'Anonymous'} - "
                f"IP: {self.get_client_ip(request)}"
            )
    
    def process_response(self, request, response):
        # Log response status for API requests
        if request.path.startswith('/api/'):
            logger.info(
                f"Response {response.status_code} for {request.method} {request.path}"
            )
        return response
    
    @staticmethod
    def get_client_ip(request):
        """Get client IP address."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class ActivityLogMiddleware(MiddlewareMixin):
    """
    Middleware to automatically log user activities.
    """
    def process_view(self, request, view_func, view_args, view_kwargs):
        # Skip logging for certain endpoints
        skip_paths = [
            '/api/v1/dashboard/activity-logs/',
            '/admin/',
            '/static/',
            '/media/',
        ]
        
        if any(request.path.startswith(path) for path in skip_paths):
            return None
        
        # Log specific actions
        if request.user.is_authenticated and request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            try:
                from apps.dashboard.models import ActivityLog
                
                action_map = {
                    'POST': 'CREATE',
                    'PUT': 'UPDATE',
                    'PATCH': 'UPDATE',
                    'DELETE': 'DELETE',
                }
                
                ActivityLog.log_activity(
                    user=request.user,
                    action=action_map.get(request.method, 'OTHER'),
                    description=f"{request.method} {request.path}",
                    ip_address=RequestLoggingMiddleware.get_client_ip(request),
                    user_agent=request.META.get('HTTP_USER_AGENT', ''),
                    metadata={
                        'method': request.method,
                        'path': request.path,
                    }
                )
            except Exception as e:
                logger.error(f"Error logging activity: {e}")
        
        return None


class MaintenanceModeMiddleware(MiddlewareMixin):
    """
    Middleware to enable maintenance mode.
    Set MAINTENANCE_MODE=True in settings to activate.
    """
    def process_request(self, request):
        from django.conf import settings
        
        # Skip for admin and allowed IPs
        if request.path.startswith('/admin/'):
            return None
        
        if getattr(settings, 'MAINTENANCE_MODE', False):
            # Allow certain IPs
            allowed_ips = getattr(settings, 'MAINTENANCE_MODE_ALLOWED_IPS', [])
            client_ip = RequestLoggingMiddleware.get_client_ip(request)
            
            if client_ip not in allowed_ips:
                return JsonResponse({
                    'success': False,
                    'message': 'Le site est actuellement en maintenance. Veuillez réessayer plus tard.',
                    'errors': {}
                }, status=503)
        
        return None
