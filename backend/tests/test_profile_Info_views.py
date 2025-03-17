import time
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from api.models import User

class ProfileInfoTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="test_user",
            email="test123@email.com",
            password="password123",
            first_name="John",
            last_name="Doe",
            bio="This is a test user.",
            academic_department="Computer Science",
            year_of_study=3,
        )
        refresh = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

    def test_profile_info_unauthenticated(self):
        url = f"/api/profile/{self.user.id}/"
        self.client.credentials()  
        response = self.client.get(url)
        self.assertEqual(response.status_code, 401)

    def test_profile_info_authenticated(self):
        url = f"/api/profile/{self.user.id}/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn("first_name", response.data)
        self.assertIn("last_name", response.data)
        self.assertIn("email", response.data)

    def test_profile_info_data(self):
        user = self.user
        url = f"/api/profile/{self.user.id}/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['first_name'], user.first_name)
        self.assertEqual(response.data['last_name'], user.last_name)
        self.assertEqual(response.data['email'], user.email)
        self.assertEqual(response.data['bio'], user.bio)
        self.assertEqual(response.data['academic_department'], user.academic_department)
        self.assertEqual(response.data['year_of_study'], user.year_of_study)
        self.assertEqual(response.data['created_at'], user.created_at.strftime("%Y-%m-%dT%H:%M:%S.%fZ"))

    def test_profile_info_response_time(self):
        url = f"/api/profile/{self.user.id}/"
        start_time = time.time()
        response = self.client.get(url)
        end_time = time.time()
        self.assertEqual(response.status_code, 200)
        self.assertTrue(end_time - start_time < 1)

    def test_profile_info_status_code(self):
        url = f"/api/profile/{self.user.id}/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        url = "/api/profile/invalid/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

    def test_profile_info_permissions(self):
        other_user = User.objects.create_user(
            username="other_user",
            email="other@email.com",
            password="password123"
        )
        refresh = RefreshToken.for_user(other_user)
        token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        url = f"/api/profile/{self.user.id}/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 403)  

        url = f"/api/profile/{other_user.id}/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_profile_info_content_type(self):
        url = f"/api/profile/{self.user.id}/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'application/json')  

    def test_profile_info_missing_field(self):
        user_without_bio = User.objects.create_user(
            username="user_without_bio",
            email="userwithoutbio@email.com",
            password="password123",
            first_name="Jane",
            last_name="Doe",
            academic_department="Mathematics",
            year_of_study=2,
        )
        refresh = RefreshToken.for_user(user_without_bio)
        token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        url = f"/api/profile/{user_without_bio.id}/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['bio'], None)
    
    def test_update_profile_info(self):
        url = f"/api/profile/{self.user.id}/"
        data = {
            "bio": "Updated bio",
            "academic_department": "Physics",
            "year_of_study": 4
        }
        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["bio"], "Updated bio")
        self.assertEqual(response.data["academic_department"], "Physics")
        self.assertEqual(response.data["year_of_study"], 4)

    def test_update_profile_permissions(self):
        other_user = User.objects.create_user(
            username="other_user",
            email="other@email.com",
            password="password123"
        )
        refresh = RefreshToken.for_user(other_user)
        token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        url = f"/api/profile/{self.user.id}/"
        data = {
            "bio": "Hacked bio",
            "academic_department": "Math"
        }
        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, 403)  

    def test_update_profile_invalid_data(self):
        url = f"/api/profile/{self.user.id}/"
        data = {
            "year_of_study": "invalid_string"  
        }
        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, 400)  

    def test_update_profile_partial_update(self):
        url = f"/api/profile/{self.user.id}/"
        data = {
            "bio": "Updated bio again"
        }
        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["bio"], "Updated bio again")
        self.assertEqual(response.data["academic_department"], self.user.academic_department) 

