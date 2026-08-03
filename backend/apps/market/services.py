import logging
from decimal import Decimal
from .models import CropCommodityPrice

logger = logging.getLogger('apps.market')

class MarketIntelligenceService:
    @staticmethod
    def get_market_trends():
        logger.info("Retrieving commodity market intelligence trends")

        default_crops = [
            ("Tomatoes", 650.00, +4.2, "Very High", 685.00),
            ("Wheat", 280.00, -1.1, "Moderate", 275.00),
            ("Maize (Corn)", 220.00, +2.5, "High", 230.00),
            ("Soybeans", 450.00, +1.8, "High", 465.00),
            ("Potatoes", 380.00, +0.5, "Moderate", 385.00)
        ]

        for name, price, change, demand, forecast in default_crops:
            if not CropCommodityPrice.objects.filter(crop_name=name).exists():
                history = [
                    {"month": "Jan", "price": round(price * 0.92, 2)},
                    {"month": "Feb", "price": round(price * 0.95, 2)},
                    {"month": "Mar", "price": round(price * 0.98, 2)},
                    {"month": "Apr", "price": price}
                ]
                CropCommodityPrice.objects.create(
                    crop_name=name,
                    market_location="Central Valley Wholesale Exchange",
                    current_price_usd_per_ton=Decimal(str(price)),
                    change_percentage=change,
                    demand_level=demand,
                    forecasted_30d_price_usd=Decimal(str(forecast)),
                    price_history=history
                )

        return CropCommodityPrice.objects.all()

    @staticmethod
    def calculate_revenue_forecast(crop_name, area_acres, expected_yield_tons_per_acre):
        commodity = CropCommodityPrice.objects.filter(crop_name__icontains=crop_name).first()
        price_per_ton = float(commodity.current_price_usd_per_ton) if commodity else 500.00

        total_yield_tons = area_acres * expected_yield_tons_per_acre
        estimated_gross_revenue = total_yield_tons * price_per_ton
        estimated_cost = estimated_gross_revenue * 0.42
        estimated_net_profit = estimated_gross_revenue - estimated_cost

        return {
            'cropName': crop_name,
            'areaAcres': area_acres,
            'totalYieldTons': round(total_yield_tons, 2),
            'pricePerTonUSD': price_per_ton,
            'estimatedGrossRevenueUSD': round(estimated_gross_revenue, 2),
            'estimatedCostUSD': round(estimated_cost, 2),
            'estimatedNetProfitUSD': round(estimated_net_profit, 2),
            'profitMarginPercent': round((estimated_net_profit / estimated_gross_revenue) * 100, 1) if estimated_gross_revenue > 0 else 0
        }
