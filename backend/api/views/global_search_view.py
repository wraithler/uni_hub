from django.db.models import Q
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from api.models import User, Community
from api.serializers import UserSerializer, CommunitySerializer


def get_filtered_queryset(model, fields, search_query):
    queryset = model.objects.all()

    if search_query:
        query_filter = Q()
        for field in fields:
            query_filter |= Q(**{f"{field}__icontains": search_query})
        queryset = queryset.filter(query_filter)

    return queryset


class GlobalSearchView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, *args, **kwargs):
        search_query = request.query_params.get("search", None).strip()

        users = get_filtered_queryset(User, ["name", "bio", "profile_picture"], search_query)
        communities = get_filtered_queryset(Community, ["name", "description", "category__name"], search_query)

        return Response({
            "users": UserSerializer(users, many=True).data,
            "communities": CommunitySerializer(communities, many=True).data
        })

