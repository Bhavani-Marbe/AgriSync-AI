from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.authentication.models import Role
from .models import CropRecommendationRecord

User = get_user_model()

class MLRecommendationEngineTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='agronomist.sam@agrisync.io',
            password='Password123!',
            first_name='Sam',
            last_name='Miller',
            role=Role.FARMER
        )
        self.client.force_authenticate(user=self.user)

    def test_crop_recommendation_endpoint(self):
        url = reverse('ml_intelligence:crop-recommendation-recommend')
        payload = {
            'nitrogen': 90.0,
            'phosphorus': 42.0,
            'potassium': 43.0,
            'temperature': 22.5,
            'humidity': 82.0,
            'ph': 6.5,
            'rainfall': 202.0,
            'season': 'Monsoon',
            'location': 'Salinas Valley'
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('recommendedCrop', response.data)
        self.assertIn('confidenceScore', response.data)
        self.assertIn('explainableAI', response.data)
        self.assertIn('featureImportances', response.data['explainableAI'])
        self.assertTrue(CropRecommendationRecord.objects.filter(user=self.user).exists())
