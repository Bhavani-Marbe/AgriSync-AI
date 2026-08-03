from rest_framework import serializers
from .models import DiseaseDiagnosis

class DiseaseDiagnoseInputSerializer(serializers.Serializer):
    imageBase64 = serializers.CharField(required=False, allow_blank=True)
    cropType = serializers.CharField(required=False, allow_blank=True, default="Tomato")
    notes = serializers.CharField(required=False, allow_blank=True, default="")

class DiseaseDiagnosisSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiseaseDiagnosis
        fields = [
            'id', 'crop_type', 'notes', 'disease_name', 'scientific_name',
            'confidence', 'severity', 'cause', 'symptoms', 'treatment',
            'medicines', 'prevention', 'nearby_support', 'created_at'
        ]
        read_only_fields = fields
