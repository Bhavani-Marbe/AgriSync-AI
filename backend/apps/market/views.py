from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .services import MarketIntelligenceService
from .serializers import CropCommodityPriceSerializer

class MarketViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        commodities = MarketIntelligenceService.get_market_trends()
        serializer = CropCommodityPriceSerializer(commodities, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='revenue-forecast')
    def revenue_forecast(self, request):
        crop = request.data.get('cropName', 'Tomatoes')
        acres = float(request.data.get('areaAcres', 10))
        yield_tons = float(request.data.get('expectedYieldTonsPerAcre', 4.5))

        forecast = MarketIntelligenceService.calculate_revenue_forecast(crop, acres, yield_tons)
        return Response(forecast, status=status.HTTP_200_OK)
