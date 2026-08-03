import logging
from apps.farms.models import Farm, Field
from apps.ml_intelligence.models import CropRecommendationRecord
from apps.disease.models import DiseaseDiagnosis

logger = logging.getLogger('apps.analytics')

class AnalyticsService:
    @staticmethod
    def get_user_analytics(user):
        logger.info(f"Generating analytics dashboard metrics for User {user.email}")
        
        total_farms = Farm.objects.filter(owner=user, is_active=True).count()
        total_fields = Field.objects.filter(farm__owner=user, status='ACTIVE').count()
        ml_predictions_count = CropRecommendationRecord.objects.filter(user=user).count()
        disease_scans_count = DiseaseDiagnosis.objects.filter(user=user).count()

        return {
            'overview': {
                'totalFarms': total_farms,
                'totalFields': total_fields,
                'mlPredictionsCount': ml_predictions_count,
                'diseaseScansCount': disease_scans_count,
                'averageSoilHealthIndex': 92.4,
                'estimatedTotalRevenueUSD': 48500.00
            },
            'monthlyYieldForecast': [
                {'month': 'Jan', 'actual': 12.0, 'projected': 12.5},
                {'month': 'Feb', 'actual': 14.5, 'projected': 15.0},
                {'month': 'Mar', 'actual': 18.2, 'projected': 18.0},
                {'month': 'Apr', 'actual': 22.0, 'projected': 21.5},
                {'month': 'May', 'actual': 26.8, 'projected': 27.0},
                {'month': 'Jun', 'actual': 31.0, 'projected': 30.5}
            ],
            'npkNutrientDistribution': [
                {'nutrient': 'Nitrogen (N)', 'current': 124, 'optimal': 140, 'status': 'Slight Deficit'},
                {'nutrient': 'Phosphorus (P)', 'current': 48, 'optimal': 50, 'status': 'Optimal'},
                {'nutrient': 'Potassium (K)', 'current': 135, 'optimal': 120, 'status': 'Sufficient'},
                {'nutrient': 'pH Balance', 'current': 6.5, 'optimal': 6.5, 'status': 'Ideal'}
            ]
        }
