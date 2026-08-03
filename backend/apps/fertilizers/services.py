import logging
from .models import FertilizerRecommendationRecord

logger = logging.getLogger('apps.fertilizers')

class FertilizerRecommendationService:
    @staticmethod
    def calculate_fertilizer_dosage(user, crop, nitrogen, phosphorus, potassium, ph):
        logger.info(f"Generating Fertilizer Schedule for User [{user.email}]: {crop} (N:{nitrogen}, P:{phosphorus}, K:{potassium})")

        deficiencies = []
        if nitrogen < 110:
            deficiencies.append(f"Nitrogen (N) Deficit (-{int(120 - nitrogen)} kg/ha)")
        if phosphorus < 45:
            deficiencies.append(f"Phosphorus (P) Deficit (-{int(50 - phosphorus)} kg/ha)")
        if potassium < 100:
            deficiencies.append(f"Potassium (K) Deficit (-{int(120 - potassium)} kg/ha)")

        if not deficiencies:
            deficiencies.append("Nutrients near optimal baseline. Maintenance dosage required.")

        fertilizers = [
            {'name': 'Urea (46% N)', 'quantityKgPerAcre': '45 kg', 'timing': 'At Vegetative Growth Stage (Day 25)', 'method': 'Soil Broadcast before Drip Run'},
            {'name': 'Di-Ammonium Phosphate (DAP 18-46-0)', 'quantityKgPerAcre': '30 kg', 'timing': 'At Basal Dressing', 'method': 'Band placement 5cm below seed'},
            {'name': 'Muriate of Potash (MOP 60% K2O)', 'quantityKgPerAcre': '25 kg', 'timing': 'At Flowering Stage', 'method': 'Fertigation via drip system'}
        ]

        schedule = [
            {'day': 'Day 1', 'task': 'Basal Soil Application', 'details': 'Mix DAP into topsoil prior to planting'},
            {'day': 'Day 25', 'task': 'First Nitrogen Fertigation', 'details': 'Dissolve Urea in fertigation tank'},
            {'day': 'Day 45', 'task': 'Potassium Boost', 'details': 'Inject MOP during flowering stage to optimize fruit setting'}
        ]

        reasoning = f"Soil test indicates NPK ratio ({nitrogen}:{phosphorus}:{potassium}) requires balanced top-dressing for {crop}. Splitting nitrogen applications minimizes volatilization and leaching losses."

        record = FertilizerRecommendationRecord.objects.create(
            user=user,
            crop=crop,
            nitrogen=nitrogen,
            phosphorus=phosphorus,
            potassium=potassium,
            ph=ph,
            deficiencies_detected=deficiencies,
            recommended_fertilizers=fertilizers,
            application_schedule=schedule,
            scientific_reasoning=reasoning
        )

        return record
