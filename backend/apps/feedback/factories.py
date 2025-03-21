import factory

from apps.feedback.models import Feedback
from apps.users.models import BaseUser


class FeedbackFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Feedback

    created_by = factory.SubFactory(BaseUser)
    content = factory.Faker("text")
    rating = factory.Faker("random_int", min=1, max=5)
    created_at = factory.Faker("date_time_this_year")
    updated_at = factory.Faker("date_time_this_year")
