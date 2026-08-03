from rest_framework import serializers
from .models import IrrigationSchedule

class IrrigationInputSerializer(serializers.Serializer):
    farmArea = serializers.FloatField(min_value=0.1, max_value=10000)
    crop = serializers.CharField(max_length=100, default="Tomatoes")
    soilType = serializers.CharField(max_length=100, default="Clay Loam")
    currentMoisture = serializers.FloatField(min_value=0, max_value=100, default=35.0)

class IrrigationScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = IrrigationSchedule
        fields = [
            'id', 'farm_area_acres', 'crop_type', 'soil_type',
            'current_moisture_percent', 'recommended_water_liters_per_acre',
            'total_water_liters', 'recommended_time_window',
            'irrigation_frequency_days', 'next_scheduled_date',
            'weather_adjustments', 'moisture_deficit_percent', 'created_at'
        ]
        read_only_fields = fields
