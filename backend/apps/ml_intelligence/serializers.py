from rest_framework import serializers
from .models import CropRecommendationRecord

class CropRecommendationInputSerializer(serializers.Serializer):
    nitrogen = serializers.FloatField(min_value=0, max_value=500)
    phosphorus = serializers.FloatField(min_value=0, max_value=500)
    potassium = serializers.FloatField(min_value=0, max_value=500)
    temperature = serializers.FloatField(min_value=-20, max_value=60)
    humidity = serializers.FloatField(min_value=0, max_value=100)
    ph = serializers.FloatField(min_value=0, max_value=14)
    rainfall = serializers.FloatField(min_value=0, max_value=1000)
    season = serializers.CharField(required=False, allow_blank=True, default="Kharif/Spring")
    location = serializers.CharField(required=False, allow_blank=True, default="Central Valley")

class CropRecommendationRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = CropRecommendationRecord
        fields = [
            'id', 'nitrogen', 'phosphorus', 'potassium',
            'temperature', 'humidity', 'ph', 'rainfall',
            'recommended_crop', 'confidence_score',
            'expected_yield_tons_per_acre', 'estimated_profit_usd_per_acre',
            'alternative_crops', 'explainable_ai', 'created_at'
        ]
        read_only_fields = fields
