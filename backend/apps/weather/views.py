from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .services import WeatherIntelligenceService
from .models import WeatherAlert
from .serializers import WeatherAlertSerializer

class WeatherViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        location = request.query_params.get('location', 'Kalaburagi, Karnataka')
        data = WeatherIntelligenceService.get_weather_forecast(location)
        return Response(data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='alerts')
    def alerts(self, request):
        alerts = WeatherAlert.objects.filter(is_active=True)
        serializer = WeatherAlertSerializer(alerts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
