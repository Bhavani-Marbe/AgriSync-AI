import uuid
from django.db import models
from django.conf import settings

class FertilizerRecommendationRecord(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='fertilizer_recommendations'
    )
    crop = models.CharField(max_length=100)
    nitrogen = models.FloatField()
    phosphorus = models.FloatField()
    potassium = models.FloatField()
    ph = models.FloatField()

    deficiencies_detected = models.JSONField(default=list)
    recommended_fertilizers = models.JSONField(default=list)
    application_schedule = models.JSONField(default=list)
    scientific_reasoning = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.crop} NPK Recommendation"
