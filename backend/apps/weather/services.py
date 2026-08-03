import logging
from .models import WeatherAlert

logger = logging.getLogger('apps.weather')

class WeatherIntelligenceService:
    @staticmethod
    def get_weather_forecast(location="Kalaburagi, Karnataka"):
        logger.info(f"Fetching microclimate weather intelligence for: {location}")
        
        # Ensure default active weather alerts exist
        if not WeatherAlert.objects.filter(location_name=location).exists():
            WeatherAlert.objects.create(
                location_name=location,
                alert_type='RAIN',
                headline='Monsoon Showers Forecasted for Kalaburagi',
                description='Precipitation probability 85% with 45mm expected rainfall accumulation in Afzalpur / Aland blocks.',
                severity='Moderate',
                action_required='Postpone scheduled urea top-dressing and chemical pesticide applications to prevent soil runoff.'
            )

        active_alerts = WeatherAlert.objects.filter(location_name=location, is_active=True)

        return {
            'city': location,
            'currentTemp': 32.5,
            'condition': 'Partly Cloudy',
            'humidity': 68,
            'windSpeedKmH': 16.5,
            'rainProbabilityPercent': 45,
            'uvIndex': 7,
            'forecast7Days': [
                {'day': 'Sun (Today)', 'tempHigh': 33, 'tempLow': 22, 'condition': 'Partly Cloudy', 'rainProb': 45},
                {'day': 'Mon', 'tempHigh': 31, 'tempLow': 21, 'condition': 'Monsoon Showers', 'rainProb': 85},
                {'day': 'Tue', 'tempHigh': 30, 'tempLow': 20, 'condition': 'Light Rain', 'rainProb': 60},
                {'day': 'Wed', 'tempHigh': 32, 'tempLow': 22, 'condition': 'Sunny Spells', 'rainProb': 20},
                {'day': 'Thu', 'tempHigh': 34, 'tempLow': 23, 'condition': 'Warm & Humid', 'rainProb': 10},
                {'day': 'Fri', 'tempHigh': 35, 'tempLow': 24, 'condition': 'Hot', 'rainProb': 5},
                {'day': 'Sat', 'tempHigh': 34, 'tempLow': 23, 'condition': 'Sunny', 'rainProb': 15}
            ],
            'farmingSuggestions': [
                'Monsoon showers forecasted for Monday (85% probability, ~45mm). Delay urea top-dressing.',
                'Optimal window for Tur & Cotton foliar spray is Wednesday through Friday under clear skies.',
                'Maintain borewell pump automation on Sunday morning to protect root moisture in Black Cotton soil.'
            ],
            'alerts': [
                {
                    'id': str(a.id),
                    'headline': a.headline,
                    'severity': a.severity,
                    'actionRequired': a.action_required
                } for a in active_alerts
            ]
        }
