from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .serializers import CropRecommendationInputSerializer, CropRecommendationRecordSerializer
from .services import CropRecommendationService
from .models import CropRecommendationRecord

class CropRecommendationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CropRecommendationRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CropRecommendationRecord.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'], url_path='recommend')
    def recommend(self, request):
        serializer = CropRecommendationInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        record, ml_result = CropRecommendationService.process_recommendation(
            request.user, serializer.validated_data
        )

        response_data = {
            'id': str(record.id),
            'recommendedCrop': ml_result['recommendedCrop'],
            'confidenceScore': ml_result['confidenceScore'],
            'expectedYieldTonsPerAcre': ml_result['expectedYieldTonsPerAcre'],
            'profitEstimationUSDPerAcre': ml_result['profitEstimationUSDPerAcre'],
            'alternativeCrops': ml_result['alternativeCrops'],
            'riskLevel': ml_result['riskLevel'],
            'explainableAI': ml_result['explainableAI'],
            'createdAt': record.created_at.isoformat()
        }
        return Response(response_data, status=status.HTTP_200_OK)
