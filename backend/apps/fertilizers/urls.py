from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FertilizerViewSet

app_name = 'fertilizers'

router = DefaultRouter()
router.register(r'fertilizers', FertilizerViewSet, basename='fertilizer-recommendation')

urlpatterns = [
    path('', include(router.urls)),
]
