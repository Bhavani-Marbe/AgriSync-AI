import uuid
from django.db import models

class CropCommodityPrice(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    crop_name = models.CharField(max_length=150, db_index=True)
    market_location = models.CharField(max_length=255)
    current_price_usd_per_ton = models.DecimalField(max_digits=10, decimal_places=2)
    change_percentage = models.FloatField()
    demand_level = models.CharField(max_length=50, default='High')
    forecasted_30d_price_usd = models.DecimalField(max_digits=10, decimal_places=2)
    price_history = models.JSONField(default=list)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['crop_name']

    def __str__(self):
        return f"{self.crop_name} @ {self.market_location}: ${self.current_price_usd_per_ton}/ton"
