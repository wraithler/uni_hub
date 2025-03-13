from rest_framework.generics import RetrieveAPIView, CreateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from api.mixins import SearchMixin
from api.models import Events, EventAttendance
from api.pagination import EventPagination
from api.serializers import EventSerializer, EventAttendanceSerializer


class EventListView(SearchMixin, ListAPIView):
    queryset = Events.objects.all()
    serializer_class = EventSerializer
    pagination_class = EventPagination

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    search_fields = ["title", "description", "location", "community__name"]


class EventDetailView(RetrieveAPIView):
    queryset = Events.objects.all()
    serializer_class = EventSerializer

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]


class EventCreateView(CreateAPIView):
    queryset = Events.objects.all()
    serializer_class = EventSerializer

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]


class EventAttendanceView(CreateAPIView):
    queryset = EventAttendance.objects.all()
    serializer_class = EventAttendanceSerializer

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]


class VirtualEventAccessView(RetrieveAPIView):
    queryset = Events.objects.filter(virtual_event=True)
    serializer_class = EventSerializer

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(id=self.kwargs["pk"])
