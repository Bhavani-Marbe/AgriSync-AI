from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.authentication.models import Role

User = get_user_model()

class ReportsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='reporter@agrisync.io',
            password='Password123!',
            first_name='Arthur',
            last_name='Dent',
            role=Role.FARMER
        )
        self.client.force_authenticate(user=self.user)

    def test_pdf_generation(self):
        url = reverse('reports:report-pdf')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'application/pdf')

    def test_summary_report(self):
        url = reverse('reports:report-summary')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('healthScore', response.data)
