from django.db.models import Prefetch, Avg, Count
from .models import Farm, Field, SoilRecord, CropHistory

class FarmRepository:
    @staticmethod
    def get_farms_by_user(user):
        return Farm.objects.filter(owner=user, is_active=True).prefetch_related('fields')

    @staticmethod
    def get_farm_by_id(farm_id, user=None):
        queryset = Farm.objects.filter(id=farm_id)
        if user:
            queryset = queryset.filter(owner=user)
        return queryset.first()

    @staticmethod
    def create_farm(owner, **data):
        return Farm.objects.create(owner=owner, **data)

    @staticmethod
    def update_farm(farm, **data):
        for key, value in data.items():
            setattr(farm, key, value)
        farm.save()
        return farm

    @staticmethod
    def delete_farm(farm):
        farm.is_active = False
        farm.save(update_fields=['is_active'])

class FieldRepository:
    @staticmethod
    def get_fields_by_farm(farm_id, user=None):
        queryset = Field.objects.filter(farm_id=farm_id)
        if user:
            queryset = queryset.filter(farm__owner=user)
        return queryset.prefetch_related('soil_records', 'crop_histories')

    @staticmethod
    def create_field(farm, **data):
        return Field.objects.create(farm=farm, **data)

class SoilRepository:
    @staticmethod
    def get_soil_records_by_field(field_id):
        return SoilRecord.objects.filter(field_id=field_id).order_by('-sampled_at')

    @staticmethod
    def create_soil_record(field, **data):
        ph = float(data.get('ph_level', 6.5))
        n = float(data.get('nitrogen_mg_kg', 40))
        p = float(data.get('phosphorus_mg_kg', 30))
        k = float(data.get('potassium_mg_kg', 150))

        score = 100
        if ph < 5.5 or ph > 8.0:
            score -= 20
        elif ph < 6.0 or ph > 7.5:
            score -= 10

        if n < 20: score -= 15
        if p < 15: score -= 15
        if k < 100: score -= 15

        data['health_score'] = max(20, min(100, score))
        return SoilRecord.objects.create(field=field, **data)
