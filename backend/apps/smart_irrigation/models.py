import uuid
from django.db import models
from django.conf import settings

class IrrigationSchedule(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='irrigation_schedules'
    )
    farm_area_acres = models.FloatField()
    crop_type = models.CharField(max_length=100)
    soil_type = models.CharField(max_length=100, default='Clay Loam')
    current_moisture_percent = models.FloatField()

    recommended_water_liters_per_acre = models.FloatField()
    total_water_liters = models.FloatField()
    recommended_time_window = models.CharField(max_length=255)
    irrigation_frequency_days = models.IntegerField(default=2)
    next_scheduled_date = models.DateField()
    weather_adjustments = models.TextField()
    moisture_deficit_percent = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.crop_type} ({self.farm_area_acres} acres) - {self.total_water_liters} L"
