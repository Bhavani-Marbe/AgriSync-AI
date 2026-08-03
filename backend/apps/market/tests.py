from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.authentication.models import Role

User = get_user_model()

class MarketIntelligenceTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='trader@agrisync.io',
            password='Password123!',
            first_name='David',
            last_name='Miller',
            role=Role.FARMER
        )
        self.client.force_authenticate(user=self.user)

    def test_list_commodities(self):
        url = reverse('market:market-commodities')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)

    def test_revenue_forecast(self):
        url = reverse('market:market-revenue-forecast')
        payload = {
            'cropName': 'Tomatoes',
            'areaAcres': 15,
            'expectedYieldTonsPerAcre': 5.0
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('estimatedGrossRevenueUSD', response.data)
