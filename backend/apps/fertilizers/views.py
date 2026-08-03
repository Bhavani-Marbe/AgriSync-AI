from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .serializers import FertilizerInputSerializer, FertilizerRecommendationRecordSerializer
from .services import FertilizerRecommendationService
from .models import FertilizerRecommendationRecord

class FertilizerViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = FertilizerRecommendationRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FertilizerRecommendationRecord.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'], url_path='recommend')
    def recommend(self, request):
        serializer = FertilizerInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        record = FertilizerRecommendationService.calculate_fertilizer_dosage(
            user=request.user,
            crop=serializer.validated_data['crop'],
            nitrogen=serializer.validated_data['nitrogen'],
            phosphorus=serializer.validated_data['phosphorus'],
            potassium=serializer.validated_data['potassium'],
            ph=serializer.validated_data['ph']
        )

        return Response({
            'targetCrop': record.crop,
            'deficienciesDetected': record.deficiencies_detected,
            'recommendedFertilizers': record.recommended_fertilizers,
            'applicationSchedule': record.application_schedule,
            'scientificReasoning': record.scientific_reasoning
        }, status=status.HTTP_200_OK)
