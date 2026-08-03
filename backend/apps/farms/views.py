from rest_framework import viewsets, permissions, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404

from apps.authentication.permissions import IsFarmer, IsOwnerOrAdmin
from .models import Farm, Field, SoilRecord, CropHistory
from .serializers import (
    FarmSerializer,
    FieldSerializer,
    SoilRecordSerializer,
    CropHistorySerializer
)
from .repositories import FarmRepository, FieldRepository, SoilRepository
from .services import FarmService, SoilIntelligenceService

class FarmViewSet(viewsets.ModelViewSet):
    serializer_class = FarmSerializer
    permission_classes = [permissions.IsAuthenticated, IsFarmer]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'location_name', 'description']
    ordering_fields = ['created_at', 'total_area_hectares', 'name']
    throttle_scope = 'farm_api'

    def get_queryset(self):
        return FarmRepository.get_farms_by_user(self.request.user)

    def perform_create(self, serializer):
        farm = serializer.save(owner=self.request.user)
        return farm

    @action(detail=True, methods=['get'])
    def analytics(self, request, pk=None):
        analytics_data = FarmService.get_farm_analytics(pk, request.user)
        if not analytics_data:
            return Response({'error': 'Farm not found or permission denied'}, status=status.HTTP_404_NOT_FOUND)
        return Response(analytics_data, status=status.HTTP_200_OK)

class FieldViewSet(viewsets.ModelViewSet):
    serializer_class = FieldSerializer
    permission_classes = [permissions.IsAuthenticated, IsFarmer]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'current_crop', 'soil_type']
    ordering_fields = ['area_hectares', 'name', 'created_at']
    throttle_scope = 'farm_api'

    def get_queryset(self):
        farm_id = self.request.query_params.get('farm')
        queryset = Field.objects.filter(farm__owner=self.request.user)
        if farm_id:
            queryset = queryset.filter(farm_id=farm_id)
        return queryset.prefetch_related('soil_records', 'crop_histories')

    def perform_create(self, serializer):
        farm_id = self.request.data.get('farm')
        farm = get_object_or_404(Farm, id=farm_id, owner=self.request.user)
        serializer.save(farm=farm)

class SoilRecordViewSet(viewsets.ModelViewSet):
    serializer_class = SoilRecordSerializer
    permission_classes = [permissions.IsAuthenticated, IsFarmer]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['sampled_at', 'ph_level', 'health_score']
    throttle_scope = 'farm_api'

    def get_queryset(self):
        field_id = self.request.query_params.get('field')
        queryset = SoilRecord.objects.filter(field__farm__owner=self.request.user)
        if field_id:
            queryset = queryset.filter(field_id=field_id)
        return queryset

    def perform_create(self, serializer):
        field_id = self.request.data.get('field')
        field = get_object_or_404(Field, id=field_id, farm__owner=self.request.user)
        soil_record = serializer.save(field=field)
        SoilIntelligenceService.analyze_soil_health_and_recommend(soil_record)

class CropHistoryViewSet(viewsets.ModelViewSet):
    serializer_class = CropHistorySerializer
    permission_classes = [permissions.IsAuthenticated, IsFarmer]
    throttle_scope = 'farm_api'

    def get_queryset(self):
        field_id = self.request.query_params.get('field')
        queryset = CropHistory.objects.filter(field__farm__owner=self.request.user)
        if field_id:
            queryset = queryset.filter(field_id=field_id)
        return queryset

    def perform_create(self, serializer):
        field_id = self.request.data.get('field')
        field = get_object_or_404(Field, id=field_id, farm__owner=self.request.user)
        serializer.save(field=field)
