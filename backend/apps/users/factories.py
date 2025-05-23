import factory.django
from faker import Faker

from apps.emails.services import verification_email_create
from apps.notification_preferences.services import notification_preference_create
from apps.users.models import BaseUser

fake = Faker()


class BaseUserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = BaseUser

    email = factory.LazyAttribute(lambda _: fake.unique.email())
    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")
    password = factory.Faker("password")
    bio = factory.Faker("text")
    academic_department = factory.Faker("text")

    @factory.post_generation
    def post(self, create, extracted, **kwargs):
        if not create:
            return

        verification_email_create(user=self)
        notification_preference_create(user=self)
