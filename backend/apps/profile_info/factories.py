import factory
from apps.users.models import BaseUser

class BaseUserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = BaseUser

    username = factory.Faker("user_name")
    email = factory.Faker("email")
    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")
    is_active = True
    is_staff = False
    is_admin = False