import factory
from apps.profile.models import Profile
from apps.users.factories import BaseUserFactory


class ProfileFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Profile

    user = factory.SubFactory(BaseUserFactory)
    gender = "M"
    hobbies = "SPORTS"
    bio = factory.Faker("paragraph")
