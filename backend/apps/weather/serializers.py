from rest_framework import serializers
from .models import WeatherAlert

class WeatherAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeatherAlert
        fields = [
            'id', 'location_name', 'alert_type', 'headline',
            'description', 'severity', 'action_required', 'is_active', 'created_at'
        ]
