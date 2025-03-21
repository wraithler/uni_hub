import factory


class BaseFactory(factory.django.DjangoModelFactory):
    class Meta:
        abstract = True

    created_at = factory.Faker("date_time_this_year")
    updated_at = factory.Faker("date_time_this_year")
