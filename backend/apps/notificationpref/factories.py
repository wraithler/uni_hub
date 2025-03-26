import factory
from apps.notificationpref.models import UserNotificationPreference
from apps.users.factories import BaseUserFactory

class UserNotificationPreferenceFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = UserNotificationPreference

    user = factory.SubFactory(BaseUserFactory)

    id = factory.Sequence(lambda n: 1000 + n)

    event_updates = factory.Faker('boolean')
    post_notifications = factory.Faker('boolean')
    announcements = factory.Faker('boolean')
    email_notifications = factory.Faker('boolean')
    in_app_notifications = factory.Faker('boolean')