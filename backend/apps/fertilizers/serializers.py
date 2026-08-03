from rest_framework import serializers
from .models import FertilizerRecommendationRecord

class FertilizerInputSerializer(serializers.Serializer):
    crop = serializers.CharField(max_length=100, default="Tomatoes")
    nitrogen = serializers.FloatField(min_value=0, max_value=500)
    phosphorus = serializers.FloatField(min_value=0, max_value=500)
    potassium = serializers.FloatField(min_value=0, max_value=500)
    ph = serializers.FloatField(min_value=0, max_value=14, default=6.5)

class FertilizerRecommendationRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = FertilizerRecommendationRecord
        fields = [
            'id', 'crop', 'nitrogen', 'phosphorus', 'potassium', 'ph',
            'deficiencies_detected', 'recommended_fertilizers',
            'application_schedule', 'scientific_reasoning', 'created_at'
        ]
        read_only_fields = fields
