from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.authentication.models import Role
from .models import DiseaseDiagnosis

User = get_user_model()

class DiseaseDetectionTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='pathologist@agrisync.io',
            password='Password123!',
            first_name='Clara',
            last_name='Oswald',
            role=Role.FARMER
        )
        self.client.force_authenticate(user=self.user)

    def test_disease_diagnose_endpoint(self):
        url = reverse('disease:disease-diagnosis-diagnose')
        payload = {
            'cropType': 'Tomato',
            'notes': 'Yellowing leaves with black spots'
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('disease_name', response.data)
        self.assertIn('confidence', response.data)
        self.assertTrue(DiseaseDiagnosis.objects.filter(user=self.user).exists())
