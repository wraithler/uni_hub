import factory
from apps.profile.models import Profile
from apps.users.factories import BaseUserFactory


class ProfileFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Profile

    user = factory.SubFactory(BaseUserFactory)
    gender = "M"
    pronouns = "HE/HIM"
    year_of_study = "1"
    hobbies = "SPORTS"
    course = "CS"
    phone_number = factory.Faker("phone_number")
    date_of_birth = factory.Faker("date_of_birth", minimum_age=18, maximum_age=30)
    github_url = factory.Faker("url")
    linkedin_url = factory.Faker("url")
