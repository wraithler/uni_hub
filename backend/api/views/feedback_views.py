from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import Feedback
from api.serializers import FeedbackSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAdminUser


class FeedbackCreateView(APIView):
    permission_classes = [IsAuthenticated] 
    authentication_classes = [JWTAuthentication] 

    def post(self, request, *args, **kwargs):
        data = request.data
        if not data.get("is_anonymous", True):
            data["user"] = request.user.id  

        serializer = FeedbackSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class FeedbackListView(APIView):
    permission_classes = [IsAdminUser]
    authentication_classes = [JWTAuthentication]

    def get(self, request, *args, **kwargs):
        feedbacks = Feedback.objects.all()
        serializer = FeedbackSerializer(feedbacks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class FeedbackDeleteView(APIView):
    permission_classes = [IsAdminUser]
    authentication_classes = [JWTAuthentication]

    def delete(self, request, feedback_id, *args, **kwargs):
        try:
            feedback = Feedback.objects.get(feedback_id=feedback_id)
            feedback.delete()
            return Response({"message": f"Feedback {feedback_id} deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        
        except Feedback.DoesNotExist:
            return Response({"error": "Feedback not found"}, status=status.HTTP_404_NOT_FOUND)

