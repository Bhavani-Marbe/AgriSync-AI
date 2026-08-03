from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.authentication.models import Role

User = get_user_model()

class AdminPortalTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            email='admin.system@agrisync.io',
            password='Password123!',
            first_name='Super',
            last_name='Admin',
            role=Role.ADMIN
        )
        self.client.force_authenticate(user=self.admin_user)

    def test_admin_system_metrics(self):
        url = reverse('admin_portal:admin-system-metrics')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['systemStatus'], 'HEALTHY')
        self.assertIn('servicesHealth', response.data)
