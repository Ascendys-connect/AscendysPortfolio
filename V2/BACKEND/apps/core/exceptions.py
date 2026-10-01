"""
Custom exception handler for consistent API responses.
"""
from rest_framework.views import exception_handler
from rest_framework.response import Response


def custom_exception_handler(exc, context):
    """
    Custom exception handler that returns a consistent error response format.
    Special handling for authentication workflows (OTP, password change).
    """
    response = exception_handler(exc, context)

    if response is not None:
        # Check if this is an authentication workflow response (OTP or password change)
        # These should NOT be wrapped in the standard error format
        if isinstance(response.data, dict):
            if 'requires_otp' in response.data or 'requires_password_change' in response.data:
                # Return the response as-is for authentication workflows
                return response
        
        # Standard error wrapping for all other cases
        custom_response = {
            'success': False,
            'message': 'Une erreur est survenue.',
            'errors': response.data
        }
        response.data = custom_response

    return response


def api_response(success=True, message='', data=None, errors=None, status_code=200):
    """
    Helper function to return consistent API responses.
    
    Args:
        success (bool): Whether the operation was successful
        message (str): Human-readable message
        data (dict): Response data
        errors (dict): Error details
        status_code (int): HTTP status code
    
    Returns:
        Response: DRF Response object
    """
    response_data = {
        'success': success,
        'message': message,
    }
    
    if data is not None:
        response_data['data'] = data
    
    if errors is not None:
        response_data['errors'] = errors
    
    return Response(response_data, status=status_code)
