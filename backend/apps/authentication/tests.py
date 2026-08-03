from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.authentication.models import Role

User = get_user_model()

class AuthenticationAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('authentication:register')
        self.login_url = reverse('authentication:login')
        self.profile_url = reverse('authentication:profile')
        self.logout_url = reverse('authentication:logout')
        self.refresh_url = reverse('authentication:token_refresh')

        self.user_data = {
            'email': 'farmer.bhavani@agrisync.io',
            'first_name': 'Bhavani',
            'last_name': 'Marbe',
            'role': Role.FARMER,
            'phone_number': '+919876543210',
            'organization_name': 'Kalaburagi Agri Producers Collective',
            'password': 'SecurePassword123!',
            'confirm_password': 'SecurePassword123!'
        }

    def test_user_registration_success(self):
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['user']['email'], self.user_data['email'])
        self.assertTrue(User.objects.filter(email=self.user_data['email']).exists())

    def test_user_registration_password_mismatch(self):
        bad_data = self.user_data.copy()
        bad_data['confirm_password'] = 'WrongPassword!'
        response = self.client.post(self.register_url, bad_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_login_and_profile_access(self):
        # Register user first
        self.client.post(self.register_url, self.user_data, format='json')

        # Login
        login_data = {
            'email': self.user_data['email'],
            'password': self.user_data['password']
        }
        login_res = self.client.post(self.login_url, login_data, format='json')
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)
        access_token = login_res.data['access']

        # Access profile with Bearer Token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        profile_res = self.client.get(self.profile_url)
        self.assertEqual(profile_res.status_code, status.HTTP_200_OK)
        self.assertEqual(profile_res.data['email'], self.user_data['email'])

    def test_token_refresh_rotation(self):
        # Register user
        reg_res = self.client.post(self.register_url, self.user_data, format='json')
        refresh_token = reg_res.data['refresh']

        # Refresh Token
        refresh_res = self.client.post(self.refresh_url, {'refresh': refresh_token}, format='json')
        self.assertEqual(refresh_res.status_code, status.HTTP_200_OK)
        self.assertIn('access', refresh_res.data)

    def test_unauthenticated_profile_access_denied(self):
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
