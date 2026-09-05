from django.conf import settings


def site_flags(request):
    return {
        'SITE_BASE': getattr(settings, 'SITE_BASE', ''),
        'STATIC_EXPORT': getattr(settings, 'STATIC_EXPORT', False),
    }
