from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.authentication.models import Role

User = get_user_model()

class NotificationsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='notif.user@agrisync.io',
            password='Password123!',
            first_name='Grace',
            last_name='Hopper',
            role=Role.FARMER
        )
        self.client.force_authenticate(user=self.user)

    def test_list_and_mark_read_notifications(self):
        url = reverse('notifications:notification-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)

        mark_all_url = reverse('notifications:notification-mark-all-read')
        response_all = self.client.post(mark_all_url)
        self.assertEqual(response_all.status_code, status.HTTP_200_OK)
