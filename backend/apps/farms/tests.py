from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.authentication.models import Role
from apps.farms.models import Farm, Field, SoilRecord, CropHistory

User = get_user_model()

class FarmManagementAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='farmer.maria@agrisync.io',
            password='SecurePassword123!',
            first_name='Maria',
            last_name='Garcia',
            role=Role.FARMER
        )
        self.client.force_authenticate(user=self.user)

        self.farm = Farm.objects.create(
            owner=self.user,
            name='Green Horizon Estate',
            description='Organic wheat and soy operations',
            location_name='Salinas Valley, CA',
            latitude=36.6777,
            longitude=-121.6555,
            total_area_hectares=150.00
        )

        self.field = Field.objects.create(
            farm=self.farm,
            name='North Parcel A',
            area_hectares=45.50,
            current_crop='Winter Wheat',
            soil_type='LOAM',
            irrigation_type='DRIP'
        )

    def test_list_farms(self):
        url = reverse('farms:farm-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['name'], 'Green Horizon Estate')

    def test_create_farm(self):
        url = reverse('farms:farm-list')
        payload = {
            'name': 'Highland Orchard',
            'description': 'Avocado and citrus fields',
            'location_name': 'Ventura, CA',
            'latitude': 34.2746,
            'longitude': -119.2290,
            'total_area_hectares': 85.00
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Farm.objects.filter(name='Highland Orchard', owner=self.user).exists())

    def test_create_soil_record_and_trigger_intelligence(self):
        url = reverse('farms:soil-record-list')
        payload = {
            'field': str(self.field.id),
            'sampled_at': '2026-08-01',
            'ph_level': 5.80,
            'nitrogen_mg_kg': 22.50,
            'phosphorus_mg_kg': 18.00,
            'potassium_mg_kg': 110.00,
            'organic_matter_percentage': 3.20,
            'moisture_percentage': 24.50,
            'electrical_conductivity': 1.20
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('recommendations', response.data)
        self.assertIn('Apply agricultural lime', response.data['recommendations'])

    def test_farm_analytics_endpoint(self):
        url = reverse('farms:farm-analytics', kwargs={'pk': str(self.farm.id)})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_fields'], 1)
        self.assertEqual(response.data['farm_name'], 'Green Horizon Estate')
