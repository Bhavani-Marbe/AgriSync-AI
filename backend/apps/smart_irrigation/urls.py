from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SmartIrrigationViewSet

app_name = 'smart_irrigation'

router = DefaultRouter()
router.register(r'irrigation', SmartIrrigationViewSet, basename='irrigation-schedule')

urlpatterns = [
    path('', include(router.urls)),
]
