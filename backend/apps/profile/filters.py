import django_filters
from apps.profile.models import Profile
from rest_framework import generics
from django.db.models import Q


class ProfileFilter(django_filters.FilterSet):
    gender = django_filters.ChoiceFilter(choices=Profile.GENDER_CHOICES)
    pronouns = django_filters.ChoiceFilter(choices=Profile.PRONOUN_CHOICES)
    hobbies = django_filters.ChoiceFilter(choices=Profile.HOBBY_CHOICES)
    course = django_filters.ChoiceFilter(choices=Profile.COURSE_CHOICES)
    year_of_study = django_filters.ChoiceFilter(choices=Profile.YEAR_CHOICES)

    class Meta:
        model = Profile
        fields = ["gender", "pronouns", "hobbies", "course", "year_of_study"]


class ProfileListAPI(generics.ListAPIView):
    queryset = Profile.objects.all()
    filterset_class = ProfileFilter
