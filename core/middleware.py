from django.utils.deprecation import MiddlewareMixin

class DisableCSRFForTokenAuth(MiddlewareMixin):
    """Desabilita CSRF para requisições com autenticação por token."""
    
    def process_request(self, request):
        # Se vem com Authorization header (Token Auth), desabilita CSRF
        if request.META.get('HTTP_AUTHORIZATION', '').startswith('Token '):
            request._dont_enforce_csrf_checks = True
        return None
