import uuid
from django.db import models
from django.conf import settings

class DiseaseDiagnosis(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='disease_diagnoses'
    )
    crop_type = models.CharField(max_length=150, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    disease_name = models.CharField(max_length=255)
    scientific_name = models.CharField(max_length=255, blank=True, null=True)
    confidence = models.FloatField()
    severity = models.CharField(max_length=50, default='Moderate')
    cause = models.TextField()
    symptoms = models.JSONField(default=list)
    treatment = models.JSONField(default=list)
    medicines = models.JSONField(default=list)
    prevention = models.JSONField(default=list)
    nearby_support = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.crop_type or 'Crop'} - {self.disease_name} ({self.confidence:.1f}%)"
