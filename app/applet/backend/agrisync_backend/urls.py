from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({
        'status': 'healthy',
        'service': 'AgriSync Enterprise Engine',
        'version': '2.0.0',
        'database': 'PostgreSQL'
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/health/', health_check, name='health_check'),
    path('api/v1/auth/', include('apps.authentication.urls')),
    path('api/v1/platform/', include('apps.farms.urls')),
]
