from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response
from .services import ReportGenerationService

class FarmHealthReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        pdf_bytes = ReportGenerationService.generate_farm_health_pdf(request.user)
        response = HttpResponse(pdf_bytes, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="AgriSync_Farm_Health_Report.pdf"'
        return response

class AgronomicSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({
            'reportType': 'Agronomic Summary & Health Audit',
            'userEmail': request.user.email,
            'healthScore': 94.5,
            'activeCrops': ['Tomatoes', 'Maize (Corn)', 'Potatoes'],
            'totalAcres': 42.5,
            'generatedAt': '2026-08-02T10:00:00Z',
            'downloadPdfUrl': '/api/v1/reports/pdf/'
        }, status=status.HTTP_200_OK)
