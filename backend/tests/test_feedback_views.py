import logging

from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from api.models import User, Feedback

logger = logging.Logger(__name__)

class FeedbackViewsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.admin_user = User.objects.create_user(
            username="admin_user",
            email="admin@example.com",
            password="adminpassword123",
            is_staff=True,  
            is_superuser=True  
        )
        refresh = RefreshToken.for_user(self.admin_user)
        self.admin_token = str(refresh.access_token)

        
        self.non_admin_user = User.objects.create_user(
            username="non_admin_user",
            email="non_admin@example.com",
            password="password123",
        )
        refresh = RefreshToken.for_user(self.non_admin_user)
        self.non_admin_token = str(refresh.access_token)

        self.user = User.objects.create_user(
            username="test_user",
            email="test123@email.com",
            password="password123",
        )
        refresh = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")


    def test_create_feedback_unauthenticated(self):
        url = "/api/feedback/create/"
        data = {"content": "This is a test feedback message."}

        self.client.credentials() 
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, 401)  

    def test_delete_feedback_not_admin(self):
        url = "/api/feedback/1/"
               
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.non_admin_token}")
        response = self.client.delete(url)
         
        self.assertEqual(response.status_code, 403) 
    
    def test_delete_feedback_admin(self):
        feedback = Feedback.objects.create(user=self.admin_user, content="Feedback to be deleted")
        url = f"/api/feedback/{feedback.feedback_id}/"
        
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.admin_token}")
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, 204) 
        self.assertEqual(Feedback.objects.count(), 0) 
    
    def test_create_feedback(self):
        url = "/api/feedback/create/"
        data = {"content": "This is a test feedback message."}
        
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.admin_token}")
        response = self.client.post(url, data, format="json")
        
        self.assertEqual(response.status_code, 201)  
        self.assertEqual(response.data["content"], "This is a test feedback message.")
    
    def test_create_feedback_invalid_data(self):
        url = "/api/feedback/create/"
        data = {"content": ""}  
        
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.admin_token}")
        response = self.client.post(url, data, format="json")
        
        self.assertEqual(response.status_code, 400)  
        self.assertIn("content", response.data) 
    
    def test_delete_feedback(self):
        feedback = Feedback.objects.create(user=self.admin_user, content="Feedback to be deleted")
        
        url = f"/api/feedback/{feedback.feedback_id}/"
        
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.admin_token}")
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, 204)  
        self.assertEqual(Feedback.objects.count(), 0)  
    
    def test_delete_non_existent_feedback(self):
        url = "/api/feedback/999/"  
        
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.admin_token}")
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, 404) 
        self.assertIn("error", response.data)  

    def test_invalid_feedback_id(self):
        url = "/api/feedback/abc/" 
        
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.admin_token}")
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, 404)  

    
    def test_create_feedback_anonymous(self):
        url = "/api/feedback/create/"
        data = {
            "content": "This is an anonymous feedback.",
            "rating": 5,
            "is_anonymous": True
        }
        
        response = self.client.post(url, data, format="json")
        
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.data["is_anonymous"])  
        self.assertEqual(response.data["content"], "This is an anonymous feedback.")
        self.assertEqual(response.data["rating"], 5)
        self.assertIsNone(response.data["user"])  

    def test_create_feedback_non_anonymous(self):
        url = "/api/feedback/create/"
        data = {
            "content": "This is non-anonymous feedback.",
            "rating": 4,
            "is_anonymous": False
        }

        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, 201)
        self.assertFalse(response.data["is_anonymous"])  
        self.assertEqual(response.data["content"], "This is non-anonymous feedback.")
        self.assertEqual(response.data["rating"], 4)
        self.assertEqual(response.data["user"], self.user.id) 