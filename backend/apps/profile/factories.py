import factory
from apps.profile.models import Profile
from apps.users.factories import BaseUserFactory


class ProfileFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Profile

    user = factory.SubFactory(BaseUserFactory)
    gender = "M"
    year_of_study = "1"
    hobbies = "SPORTS"
    course = "CS"
    phone_number = factory.Faker("phone_number")
    student_number = factory.Faker("student_number")
    github_url = factory.Faker("url")
    linkedin_url = factory.Faker("url")
