import logging
from django.db import transaction
from apps.audit.models import AuditLog
from .models import SoilRecord
from .repositories import FarmRepository, FieldRepository, SoilRepository

logger = logging.getLogger('apps.farms')

class FarmService:
    @staticmethod
    def list_user_farms(user):
        logger.info(f"Fetching farm portfolio for User: {user.email}")
        return FarmRepository.get_farms_by_user(user)

    @staticmethod
    @transaction.atomic
    def create_farm_with_initial_fields(user, farm_data, fields_data=None):
        logger.info(f"Creating new Farm [{farm_data.get('name')}] for User [{user.email}]")
        farm = FarmRepository.create_farm(owner=user, **farm_data)

        if fields_data:
            for field_data in fields_data:
                FieldRepository.create_field(farm=farm, **field_data)

        AuditLog.objects.create(
            user=user,
            user_email=user.email,
            action='FARM_CREATED',
            details={'farm_id': str(farm.id), 'farm_name': farm.name}
        )
        return farm

    @staticmethod
    def get_farm_analytics(farm_id, user):
        farm = FarmRepository.get_farm_by_id(farm_id, user=user)
        if not farm:
            return None

        fields = FieldRepository.get_fields_by_farm(farm_id, user=user)
        total_fields = fields.count()

        return {
            'farm_id': str(farm.id),
            'farm_name': farm.name,
            'total_area': float(farm.total_area_hectares),
            'total_fields': total_fields,
            'active_crops': [f.current_crop for f in fields if f.current_crop],
        }

class SoilIntelligenceService:
    @staticmethod
    def analyze_soil_health_and_recommend(soil_record):
        ph = float(soil_record.ph_level)
        n = float(soil_record.nitrogen_mg_kg)
        p = float(soil_record.phosphorus_mg_kg)
        k = float(soil_record.potassium_mg_kg)

        recommendations = []
        if ph < 6.0:
            recommendations.append("Apply agricultural lime (calcium carbonate) to increase soil pH to optimal 6.5-7.0 range.")
        elif ph > 7.8:
            recommendations.append("Apply elemental sulfur or ammonium sulfate to lower soil alkalinity.")

        if n < 30:
            recommendations.append("Nitrogen deficiency detected. Apply slow-release urea or organic compost.")
        if p < 20:
            recommendations.append("Low phosphorus. Top-dress with triple superphosphate (TSP) or bone meal prior to planting.")
        if k < 120:
            recommendations.append("Potassium deficit. Apply muriate of potash (MOP) to improve disease resistance and water regulation.")

        if not recommendations:
            recommendations.append("Soil nutrient balance is optimal. Maintain current organic crop rotation practice.")

        soil_record.recommendations = " ".join(recommendations)
        soil_record.save(update_fields=['recommendations'])
        return soil_record
