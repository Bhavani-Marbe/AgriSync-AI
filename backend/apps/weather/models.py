import uuid
from django.db import models

class WeatherAlert(models.Model):
    ALERT_TYPES = [
        ('FROST', 'Frost Warning'),
        ('RAIN', 'Heavy Rainfall Risk'),
        ('HEAT', 'Extreme Thermal Stress'),
        ('WIND', 'High Wind Hazard'),
        ('PEST', 'Pest Outbreak Climate Risk')
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    location_name = models.CharField(max_length=255, db_index=True)
    alert_type = models.CharField(max_length=50, choices=ALERT_TYPES)
    headline = models.CharField(max_length=255)
    description = models.TextField()
    severity = models.CharField(max_length=50, default='Moderate')
    action_required = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.location_name} - {self.headline} ({self.severity})"
