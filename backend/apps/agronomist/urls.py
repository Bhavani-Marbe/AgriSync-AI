from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AgronomistViewSet

app_name = 'agronomist'

router = DefaultRouter()
router.register(r'agronomist/conversations', AgronomistViewSet, basename='agronomist-conversation')

urlpatterns = [
    path('', include(router.urls)),
]
