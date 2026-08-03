from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FarmViewSet,
    FieldViewSet,
    SoilRecordViewSet,
    CropHistoryViewSet
)

app_name = 'farms'

router = DefaultRouter()
router.register(r'farms', FarmViewSet, basename='farm')
router.register(r'fields', FieldViewSet, basename='field')
router.register(r'soil-records', SoilRecordViewSet, basename='soil-record')
router.register(r'crop-histories', CropHistoryViewSet, basename='crop-history')

urlpatterns = [
    path('', include(router.urls)),
]
