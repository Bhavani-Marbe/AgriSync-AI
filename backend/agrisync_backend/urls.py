from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({
        'status': 'healthy',
        'service': 'AgriSync AI Backend Engine',
        'version': '1.0.0',
        'database': 'connected'
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/health/', health_check, name='health_check'),
    path('api/v1/auth/', include(('apps.authentication.urls', 'authentication'))),
    path('api/v1/platform/', include(('apps.farms.urls', 'farms'))),
    path('api/v1/ml/', include(('apps.ml_intelligence.urls', 'ml_intelligence'))),
    path('api/v1/pathology/', include(('apps.disease.urls', 'disease'))),
    path('api/v1/climate/', include(('apps.weather.urls', 'weather'))),
    path('api/v1/economy/', include(('apps.market.urls', 'market'))),
    path('api/v1/advisory/', include(('apps.agronomist.urls', 'agronomist'))),
    path('api/v1/water/', include(('apps.smart_irrigation.urls', 'smart_irrigation'))),
    path('api/v1/soil/', include(('apps.fertilizers.urls', 'fertilizers'))),
    path('api/v1/alerts/', include(('apps.notifications.urls', 'notifications'))),
    path('api/v1/reports/', include(('apps.reports.urls', 'reports'))),
    path('api/v1/metrics/', include(('apps.analytics.urls', 'analytics'))),
    path('api/v1/ops/', include(('apps.admin_portal.urls', 'admin_portal'))),
]
