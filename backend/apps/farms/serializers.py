from rest_framework import serializers
from .models import Farm, Field, SoilRecord, CropHistory

class SoilRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoilRecord
        fields = [
            'id', 'field', 'sampled_at', 'ph_level',
            'nitrogen_mg_kg', 'phosphorus_mg_kg', 'potassium_mg_kg',
            'organic_matter_percentage', 'moisture_percentage',
            'electrical_conductivity', 'health_score', 'recommendations',
            'created_at'
        ]
        read_only_fields = ['id', 'health_score', 'created_at']

    def validate_ph_level(self, value):
        if value < 0 or value > 14:
            raise serializers.ValidationError("pH level must be between 0.0 and 14.0")
        return value

class CropHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CropHistory
        fields = [
            'id', 'field', 'crop_name', 'variety',
            'planting_date', 'harvest_date', 'yield_tonnes_per_hectare',
            'season', 'notes', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

class FieldSerializer(serializers.ModelSerializer):
    soil_records = SoilRecordSerializer(many=True, read_only=True)
    crop_histories = CropHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Field
        fields = [
            'id', 'farm', 'name', 'area_hectares', 'current_crop',
            'soil_type', 'irrigation_type', 'status',
            'boundary_coordinates', 'soil_records', 'crop_histories',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_area_hectares(self, value):
        if value <= 0:
            raise serializers.ValidationError("Field area must be greater than 0 hectares.")
        return value

class FarmSerializer(serializers.ModelSerializer):
    fields = FieldSerializer(many=True, read_only=True)
    owner_name = serializers.ReadOnlyField(source='owner.full_name')

    class Meta:
        model = Farm
        fields = [
            'id', 'owner', 'owner_name', 'name', 'description',
            'location_name', 'latitude', 'longitude',
            'total_area_hectares', 'is_active', 'fields',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']

    def validate(self, attrs):
        lat = attrs.get('latitude')
        lng = attrs.get('longitude')
        if lat is not None and (lat < -90 or lat > 90):
            raise serializers.ValidationError({"latitude": "Latitude must be between -90 and 90."})
        if lng is not None and (lng < -180 or lng > 180):
            raise serializers.ValidationError({"longitude": "Longitude must be between -180 and 180."})
        return attrs
