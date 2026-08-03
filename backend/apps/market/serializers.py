from rest_framework import serializers
from .models import CropCommodityPrice

class CropCommodityPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = CropCommodityPrice
        fields = [
            'id', 'crop_name', 'market_location',
            'current_price_usd_per_ton', 'change_percentage',
            'demand_level', 'forecasted_30d_price_usd',
            'price_history', 'updated_at'
        ]
