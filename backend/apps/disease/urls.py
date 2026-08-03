from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DiseaseDiagnosisViewSet

app_name = 'disease'

router = DefaultRouter()
router.register(r'disease', DiseaseDiagnosisViewSet, basename='disease-diagnosis')

urlpatterns = [
    path('', include(router.urls)),
]
