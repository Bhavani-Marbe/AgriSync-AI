from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response
from .services import AdminPortalService

class AdminSystemMetricsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        metrics = AdminPortalService.get_system_health_metrics()
        return Response(metrics, status=status.HTTP_200_OK)
