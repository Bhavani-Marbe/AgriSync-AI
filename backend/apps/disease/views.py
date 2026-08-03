from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .serializers import DiseaseDiagnoseInputSerializer, DiseaseDiagnosisSerializer
from .services import DiseaseDetectionService
from .models import DiseaseDiagnosis

class DiseaseDiagnosisViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = DiseaseDiagnosisSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return DiseaseDiagnosis.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'], url_path='diagnose')
    def diagnose(self, request):
        serializer = DiseaseDiagnoseInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        diagnosis = DiseaseDetectionService.diagnose_crop_health(
            user=request.user,
            image_base64=serializer.validated_data.get('imageBase64', ''),
            crop_type=serializer.validated_data.get('cropType', 'Tomato'),
            notes=serializer.validated_data.get('notes', '')
        )

        return Response(DiseaseDiagnosisSerializer(diagnosis).data, status=status.HTTP_200_OK)
