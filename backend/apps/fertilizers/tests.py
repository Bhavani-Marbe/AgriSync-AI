from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.authentication.models import Role

User = get_user_model()

class FertilizerRecommendationTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='soil.scientist@agrisync.io',
            password='Password123!',
            first_name='Marcus',
            last_name='Vance',
            role=Role.FARMER
        )
        self.client.force_authenticate(user=self.user)

    def test_fertilizer_recommendation(self):
        url = reverse('fertilizers:fertilizer-recommendation-recommend')
        payload = {
            'crop': 'Tomatoes',
            'nitrogen': 85.0,
            'phosphorus': 38.0,
            'potassium': 95.0,
            'ph': 6.4
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('deficienciesDetected', response.data)
        self.assertIn('recommendedFertilizers', response.data)
