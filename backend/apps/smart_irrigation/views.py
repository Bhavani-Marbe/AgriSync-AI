from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .serializers import IrrigationInputSerializer, IrrigationScheduleSerializer
from .services import SmartIrrigationService
from .models import IrrigationSchedule

class SmartIrrigationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = IrrigationScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return IrrigationSchedule.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'], url_path='recommend')
    def recommend(self, request):
        serializer = IrrigationInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        schedule = SmartIrrigationService.calculate_irrigation(
            user=request.user,
            farm_area=serializer.validated_data['farmArea'],
            crop=serializer.validated_data['crop'],
            soil_type=serializer.validated_data['soilType'],
            current_moisture=serializer.validated_data['currentMoisture']
        )

        return Response({
            'id': str(schedule.id),
            'waterQuantityLitersPerAcre': schedule.recommended_water_liters_per_acre,
            'totalWaterNeededLiters': schedule.total_water_liters,
            'recommendedTimeOfDay': schedule.recommended_time_window,
            'irrigationFrequencyDays': schedule.irrigation_frequency_days,
            'nextScheduledDate': schedule.next_scheduled_date.isoformat(),
            'weatherAdjustments': schedule.weather_adjustments,
            'moistureDeficitPercentage': schedule.moisture_deficit_percent,
            'actionRequired': schedule.moisture_deficit_percent > 20
        }, status=status.HTTP_200_OK)
