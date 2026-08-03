from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.authentication.models import Role

User = get_user_model()

class AgronomistTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='agronomy.lead@agrisync.io',
            password='Password123!',
            first_name='Elena',
            last_name='Rostova',
            role=Role.FARMER
        )
        self.client.force_authenticate(user=self.user)

    def test_agronomist_chat(self):
        url = reverse('agronomist:agronomist-conversation-chat')
        payload = {
            'message': 'What is the optimal nitrogen application timing for corn during vegetative stage?'
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('reply', response.data)
        self.assertIn('conversationId', response.data)
