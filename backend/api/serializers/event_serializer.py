from rest_framework import serializers
from api.models import Events, EventAttendance


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Events
        fields = "__all__"

    def validate(self, data):
        # Ensure virtual events have a valid link
        if data.get("virtual_event") and not data.get("virtual_link"):
            raise serializers.ValidationError("Virtual events must have a valid virtual link.")
        return data


class EventAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventAttendance
        fields = "__all__"

    def validate(self, data):
        # Ensure a user cannot register for the same event twice
        if EventAttendance.objects.filter(user=data["user"], event=data["event"]).exists():
            raise serializers.ValidationError("User is already registered for this event.")
        return data
