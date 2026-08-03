import uuid
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator

class Farm(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='farms',
        db_index=True
    )
    name = models.CharField(max_length=255, db_index=True)
    description = models.TextField(blank=True, null=True)
    location_name = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, validators=[MinValueValidator(-90), MaxValueValidator(90)])
    longitude = models.DecimalField(max_digits=9, decimal_places=6, validators=[MinValueValidator(-180), MaxValueValidator(180)])
    total_area_hectares = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.01)])
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['owner', 'is_active']),
            models.Index(fields=['latitude', 'longitude']),
        ]

    def __str__(self):
        return f"{self.name} ({self.location_name})"

class Field(models.Model):
    SOIL_TYPES = [
        ('CLAY', 'Clay Soil'),
        ('SANDY', 'Sandy Soil'),
        ('LOAM', 'Loam Soil'),
        ('SILT', 'Silt Soil'),
        ('PEAT', 'Peat Soil'),
        ('CHALKY', 'Chalky Soil'),
    ]

    IRRIGATION_TYPES = [
        ('DRIP', 'Drip Irrigation'),
        ('SPRINKLER', 'Sprinkler System'),
        ('CENTER_PIVOT', 'Center Pivot'),
        ('FLOOD', 'Flood/Surface Irrigation'),
        ('RAINFED', 'Rainfed / Natural'),
    ]

    FIELD_STATUS = [
        ('ACTIVE', 'Active Cultivation'),
        ('FALLOW', 'Fallow / Resting'),
        ('PREPARATION', 'Land Preparation'),
        ('HARVESTED', 'Harvested'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE, related_name='fields', db_index=True)
    name = models.CharField(max_length=255)
    area_hectares = models.DecimalField(max_digits=8, decimal_places=2, validators=[MinValueValidator(0.01)])
    current_crop = models.CharField(max_length=150, blank=True, null=True)
    soil_type = models.CharField(max_length=50, choices=SOIL_TYPES, default='LOAM')
    irrigation_type = models.CharField(max_length=50, choices=IRRIGATION_TYPES, default='DRIP')
    status = models.CharField(max_length=50, choices=FIELD_STATUS, default='ACTIVE')
    boundary_coordinates = models.JSONField(
        default=dict,
        blank=True,
        help_text="Polygon JSON coordinates defining field geographical boundary"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} - {self.farm.name}"

class SoilRecord(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    field = models.ForeignKey(Field, on_delete=models.CASCADE, related_name='soil_records', db_index=True)
    sampled_at = models.DateField(db_index=True)
    ph_level = models.DecimalField(max_digits=4, decimal_places=2, validators=[MinValueValidator(0.0), MaxValueValidator(14.0)])
    nitrogen_mg_kg = models.DecimalField(max_digits=8, decimal_places=2, validators=[MinValueValidator(0.0)])
    phosphorus_mg_kg = models.DecimalField(max_digits=8, decimal_places=2, validators=[MinValueValidator(0.0)])
    potassium_mg_kg = models.DecimalField(max_digits=8, decimal_places=2, validators=[MinValueValidator(0.0)])
    organic_matter_percentage = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0.0), MaxValueValidator(100.0)])
    moisture_percentage = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0.0), MaxValueValidator(100.0)])
    electrical_conductivity = models.DecimalField(max_digits=6, decimal_places=2, default=0.0, help_text="dS/m")
    health_score = models.IntegerField(default=85, validators=[MinValueValidator(0), MaxValueValidator(100)])
    recommendations = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-sampled_at']

    def __str__(self):
        return f"Soil Sample {self.sampled_at} - {self.field.name} (pH: {self.ph_level})"

class CropHistory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    field = models.ForeignKey(Field, on_delete=models.CASCADE, related_name='crop_histories', db_index=True)
    crop_name = models.CharField(max_length=150)
    variety = models.CharField(max_length=150, blank=True, null=True)
    planting_date = models.DateField()
    harvest_date = models.DateField(blank=True, null=True)
    yield_tonnes_per_hectare = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    season = models.CharField(max_length=50, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-planting_date']

    def __str__(self):
        return f"{self.crop_name} ({self.planting_date.year}) - {self.field.name}"
