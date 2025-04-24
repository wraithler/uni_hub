import factory
from factory import Faker, SubFactory
from factory.django import DjangoModelFactory

from apps.notifications.models import Notification
from apps.users.factories import BaseUserFactory


class NotificationFactory(DjangoModelFactory):
    class Meta:
        model = Notification

    recipient = SubFactory(BaseUserFactory)
    message = Faker("paragraph")
    is_read = Faker("boolean")
    notification_type = Faker(
        "random_element", elements=["info", "alert", "reminder", "promo"]
    )
