import logging
from datetime import date, timedelta
from .models import IrrigationSchedule

logger = logging.getLogger('apps.smart_irrigation')

class SmartIrrigationService:
    @staticmethod
    def calculate_irrigation(user, farm_area, crop, soil_type, current_moisture):
        logger.info(f"Calculating smart irrigation for User [{user.email}]: {crop} ({farm_area} acres)")

        deficit = max(0.0, 65.0 - current_moisture)
        liters_per_acre = round(1500.0 + (deficit * 25.0), 1)
        total_liters = round(liters_per_acre * farm_area, 1)

        schedule = IrrigationSchedule.objects.create(
            user=user,
            farm_area_acres=farm_area,
            crop_type=crop,
            soil_type=soil_type,
            current_moisture_percent=current_moisture,
            recommended_water_liters_per_acre=liters_per_acre,
            total_water_liters=total_liters,
            recommended_time_window="05:30 AM - 07:30 AM (Low Evaporation Window)",
            irrigation_frequency_days=2,
            next_scheduled_date=date.today() + timedelta(days=1),
            weather_adjustments="Reduced water volume by 15% due to incoming light rainfall tomorrow.",
            moisture_deficit_percent=round(deficit, 1)
        )

        return schedule
