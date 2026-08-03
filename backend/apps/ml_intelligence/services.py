import logging
from .ml_engine import predict_crop_recommendation
from .models import CropRecommendationRecord
from apps.audit.models import AuditLog

logger = logging.getLogger('apps.ml_intelligence')

class CropRecommendationService:
    @staticmethod
    def process_recommendation(user, data):
        logger.info(f"Generating ML Crop Recommendation for User: {user.email}")
        n = data['nitrogen']
        p = data['phosphorus']
        k = data['potassium']
        temp = data['temperature']
        hum = data['humidity']
        ph = data['ph']
        rain = data['rainfall']
        loc = data.get('location', '')

        ml_result = predict_crop_recommendation(n, p, k, temp, hum, ph, rain, location=loc)

        record = CropRecommendationRecord.objects.create(
            user=user,
            nitrogen=n,
            phosphorus=p,
            potassium=k,
            temperature=temp,
            humidity=hum,
            ph=ph,
            rainfall=rain,
            recommended_crop=ml_result['recommendedCrop'],
            confidence_score=ml_result['confidenceScore'],
            expected_yield_tons_per_acre=ml_result['expectedYieldTonsPerAcre'],
            estimated_profit_usd_per_acre=ml_result['profitEstimationUSDPerAcre'],
            alternative_crops=ml_result['alternativeCrops'],
            explainable_ai=ml_result['explainableAI']
        )

        AuditLog.objects.create(
            user=user,
            user_email=user.email,
            action='ML_CROP_RECOMMENDATION_EXECUTED',
            details={'record_id': str(record.id), 'crop': record.recommended_crop}
        )

        return record, ml_result
