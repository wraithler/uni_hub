from apps.profile.services import profile_display, profile_update
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, serializers
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.authentication import JWTAuthentication
from apps.profile.models import Profile
from apps.profile.selectors import profile_get
from apps.api.mixins import AuthAPIView


class ProfileSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    first_name = serializers.CharField(source="user.first_name", read_only=True)
    last_name = serializers.CharField(source="user.last_name",  read_only=True)
    gender_display = serializers.CharField(source="get_gender_display", read_only=True)
    course_display = serializers.CharField(source="get_course_display", read_only=True)
    hobbies_display = serializers.CharField(source="get_hobbies_display", read_only=True)

    class Meta:
        model  = Profile
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "gender",
            "gender_display",
            "hobbies",
            "hobbies_display",
            "course",
            "course_display",
            "year_of_study",
            "phone_number",
            "student_number",
            "github_url",
            "linkedin_url",
        ]


class ProfileView(AuthAPIView, APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer
    lookup_field = 'pk'
    lookup_url_kwarg = 'pk'

    def get_profile(self, user):
        profile = profile_get(user=user)
        if not profile:
            return None
        return profile

    def get(self, request, pk):
        profile = get_object_or_404(Profile, pk=pk)
        data = profile_display(profile, request.user)
        return Response(data)

    
    def patch(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        try:
            profile = get_object_or_404(Profile, pk=pk, user=request.user)
            updated_profile = profile_update(
                user=request.user, 
                profile=profile, 
                data=request.data
            )
            serializer = ProfileSerializer(updated_profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except ValidationError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Add this line to see the actual error in your server logs
            print(f"Server Error during PATCH: {str(e)}")
            return Response(
                {"detail": f"An error occurred: {str(e)}"},  # More detailed error
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ProfileCreateView(AuthAPIView, APIView):
    def get(self, request):
        profiles = Profile.objects.all()
        serializer = ProfileSerializer(profiles, many=True)
        return Response(serializer.data)

    def post(self, request):
        existing_profile = profile_get(user=request.user)
        if existing_profile:
            return Response({"detail": "Profile already exists."}, status=400)

        serializer = ProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class ProfileChoicesView(APIView):
    def get(self, request):
        return Response(
            {
                "gender_choices": dict(Profile.GENDER_CHOICES),
                "hobby_choices": dict(Profile.HOBBY_CHOICES),
                "course_choices": dict(Profile.COURSE_CHOICES),
                "year_choices": dict(Profile.YEAR_CHOICES),
            },
            status=status.HTTP_200_OK
        )


