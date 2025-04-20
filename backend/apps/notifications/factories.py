import factory
from factory import Faker, SubFactory
from factory.django import DjangoModelFactory
from apps.notifications.models import Notification
from apps.users.factories import BaseUserFactory

class NotificationFactory(DjangoModelFactory):
    class Meta:
        model = Notification
        
    user = SubFactory(BaseUserFactory)
    title = Faker("sentence", nb_words=4)
    content = Faker("paragraph")
    is_read = Faker("boolean")
    notification_type = Faker("random_element", elements=["EVENT", "POST", "FRIEND", "SYSTEM"])
    created_at = Faker("date_time_this_year")
    related_object_id = Faker("random_int", min=1, max=1000)
    related_object_type = Faker("random_element", elements=["post", "event", "user", "community"])