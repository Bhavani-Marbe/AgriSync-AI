from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.authentication.models import Role

User = get_user_model()

class WeatherIntelligenceTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='meteorologist@agrisync.io',
            password='Password123!',
            first_name='Storm',
            last_name='Walker',
            role=Role.FARMER
        )
        self.client.force_authenticate(user=self.user)

    def test_get_weather(self):
        url = reverse('weather:weather-current')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('forecast7Days', response.data)
        self.assertIn('farmingSuggestions', response.data)

    def test_get_weather_alerts(self):
        url = reverse('weather:weather-alerts')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
