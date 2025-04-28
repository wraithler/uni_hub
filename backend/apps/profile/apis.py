from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from apps.profile.models import Profile
from apps.profile.selectors import profile_get
from apps.api.mixins import ApiAuthMixin


class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)
    first_name = serializers.CharField(source="user.first_name", read_only=True)
    last_name = serializers.CharField(source="user.last_name", read_only=True)

    class Meta:
        model = Profile
        fields = [
            "email",
            "first_name",
            "last_name",
            "gender",
            "hobbies",
            "bio",
            "website_url",
            "github_url",
            "linkedin_url",
        ]


class ProfileView(ApiAuthMixin, APIView):
    def get_profile(self, user):
        profile = profile_get(user=user)
        if not profile:
            return None
        return profile

    def get(self, request):
        profile = self.get_profile(request.user)
        if not profile:
            return Response(
                {"detail": "Profile not found"}, status=status.HTTP_404_NOT_FOUND
            )
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def patch(self, request):
        profile = self.get_profile(request.user)
        if not profile:
            return Response(
                {"detail": "Profile not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ProfileCreateView(ApiAuthMixin, APIView):
    def post(self, request):
        # Check if the profile already exists for the user
        existing_profile = profile_get(user=request.user)
        if existing_profile:
            return Response({"detail": "Profile already exists."}, status=400)

        # Create a new profile if it does not exist
        serializer = ProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class ProfileChoicesView(APIView):
    def get(self, request):
        gender_choices = dict(Profile.GENDER_CHOICES)
        hobby_choices = dict(Profile.HOBBY_CHOICES)
        return Response(
            {
                "gender_choices": gender_choices,
                "hobby_choices": hobby_choices
            },
            status=status.HTTP_200_OK
        )