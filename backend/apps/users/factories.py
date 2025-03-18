import factory.django
from faker import Faker

from apps.users.models import BaseUser

fake = Faker()

class BaseUserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = BaseUser

    username = factory.LazyAttribute(lambda _: fake.unique.user_name())
    email = factory.LazyAttribute(lambda _: fake.unique.email())
    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")
    password = factory.Faker("password")
    profile_picture = factory.Faker("image_url")
    bio = factory.Faker("text")
    academic_department = factory.Faker("text")
    year_of_study = factory.Faker("pyint", min_value=1, max_value=6)
