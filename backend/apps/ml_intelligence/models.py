import uuid
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator

class CropRecommendationRecord(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='crop_recommendations'
    )
    nitrogen = models.FloatField(validators=[MinValueValidator(0)])
    phosphorus = models.FloatField(validators=[MinValueValidator(0)])
    potassium = models.FloatField(validators=[MinValueValidator(0)])
    temperature = models.FloatField()
    humidity = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    ph = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(14)])
    rainfall = models.FloatField(validators=[MinValueValidator(0)])

    recommended_crop = models.CharField(max_length=100)
    confidence_score = models.FloatField()
    expected_yield_tons_per_acre = models.FloatField()
    estimated_profit_usd_per_acre = models.FloatField()
    alternative_crops = models.JSONField(default=list)
    explainable_ai = models.JSONField(default=dict)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.recommended_crop} ({self.confidence_score:.1f}%)"
