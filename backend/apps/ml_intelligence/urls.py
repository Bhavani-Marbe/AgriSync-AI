from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CropRecommendationViewSet

app_name = 'ml_intelligence'

router = DefaultRouter()
router.register(r'crops', CropRecommendationViewSet, basename='crop-recommendation')

urlpatterns = [
    path('', include(router.urls)),
]
