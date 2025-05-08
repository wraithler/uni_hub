import factory
from django.contrib.contenttypes.models import ContentType
from apps.users.factories import BaseUserFactory
from .models import Notification


class NotificationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Notification

    recipient = factory.SubFactory(BaseUserFactory)
    title = factory.Faker("sentence")
    message = factory.Faker("paragraph")
    notification_type = "info"
    channel = "in_app"
    status = "sent"
    is_read = False
    content_type = factory.LazyFunction(
        lambda: ContentType.objects.get_for_model(BaseUserFactory._meta.model)
    )
    object_id = factory.Sequence(lambda n: n)
