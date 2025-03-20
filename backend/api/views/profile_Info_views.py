from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import User
from api.serializers import ProfileInfoSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication


class ProfileInfoView(APIView):
    queryset = User.objects.all()
    serializer_class = ProfileInfoSerializer
    permission_classes = [IsAuthenticated] 
    authentication_classes = [JWTAuthentication] 
  
    def get(self, request, *args, **kwargs):
        user_id = kwargs.get('user_id') 
        if user_id and int(user_id) != request.user.id:
            return Response({"detail": "You do not have permission to view this profile."}, status=status.HTTP_403_FORBIDDEN)
        
        user = request.user if not user_id else User.objects.get(id=user_id)
        serializer = ProfileInfoSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def patch(self, request, *args, **kwargs):
        user_id = kwargs.get("user_id")
        
        if request.user.id != int(user_id):  
            return Response(
                {"detail": "You do not have permission to edit this profile."},
                status=status.HTTP_403_FORBIDDEN
            )

        user = request.user  
        serializer = self.serializer_class(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

