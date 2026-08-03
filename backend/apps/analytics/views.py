from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response
from .services import AnalyticsService

class UserAnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        data = AnalyticsService.get_user_analytics(request.user)
        return Response(data, status=status.HTTP_200_OK)
