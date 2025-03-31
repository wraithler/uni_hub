import django_filters
from apps.profile.models import Profile
from rest_framework import generics
from django.db.models import Q


class ProfileFilter(django_filters.FilterSet):
    gender = django_filters.ChoiceFilter(choices=Profile.GENDER_CHOICES)
    hobbies = django_filters.ChoiceFilter(choices=Profile.HOBBY_CHOICES)
    has_bio = django_filters.BooleanFilter(method="filter_has_bio")

    class Meta:
        model = Profile
        fields = ["gender", "hobbies"]

    def filter_has_bio(self, queryset, name, value):
        if value:
            # Has bio: not empty and not null
            return queryset.exclude(Q(bio__exact="") | Q(bio__isnull=True))
        else:
            # No bio: empty or null
            return queryset.filter(Q(bio__exact="") | Q(bio__isnull=True))


class ProfileListAPI(generics.ListAPIView):
    queryset = Profile.objects.all()
    filterset_class = ProfileFilter
