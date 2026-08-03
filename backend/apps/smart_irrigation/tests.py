from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.authentication.models import Role

User = get_user_model()

class SmartIrrigationTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='irrigation.lead@agrisync.io',
            password='Password123!',
            first_name='Kai',
            last_name='Nakamura',
            role=Role.FARMER
        )
        self.client.force_authenticate(user=self.user)

    def test_irrigation_recommendation(self):
        url = reverse('smart_irrigation:irrigation-schedule-recommend')
        payload = {
            'farmArea': 12.5,
            'crop': 'Tomatoes',
            'soilType': 'Clay Loam',
            'currentMoisture': 28.0
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('totalWaterNeededLiters', response.data)
        self.assertIn('nextScheduledDate', response.data)
