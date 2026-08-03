from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.authentication.models import Role

User = get_user_model()

class AnalyticsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='analyst@agrisync.io',
            password='Password123!',
            first_name='Ada',
            last_name='Lovelace',
            role=Role.FARMER
        )
        self.client.force_authenticate(user=self.user)

    def test_analytics_dashboard(self):
        url = reverse('analytics:analytics-dashboard')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('overview', response.data)
        self.assertIn('monthlyYieldForecast', response.data)
