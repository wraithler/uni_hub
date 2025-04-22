import factory
import random
from django.core.files.uploadedfile import SimpleUploadedFile
from faker import Faker

from apps.reports.models import ReportCategory, Report, ReportAttachment, ReportStatus
from apps.users.factories import BaseUserFactory
from apps.communities.factories import CommunityFactory

fake = Faker()


class ReportCategoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ReportCategory

    name = factory.Faker("sentence", nb_words=3)
    description = factory.Faker("text")
    is_active = factory.Faker("boolean")


class ReportFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Report

    reported_by = factory.SubFactory(BaseUserFactory)
    reported_user = factory.SubFactory(BaseUserFactory)
    community = factory.SubFactory(CommunityFactory)
    category = factory.SubFactory(ReportCategoryFactory)

    title = factory.Faker("sentence", nb_words=10)
    description = factory.Faker("text")
    status = factory.LazyAttribute(
        lambda _: random.choice([status[0] for status in ReportStatus.choices])
    )
    evidence_links = factory.LazyAttribute(
        lambda _: {"link1": fake.url(), "link2": fake.url()}
    )

    @factory.post_generation
    def resolution_notes(self, create, extracted, **kwargs):
        if create and random.choice([True, False]):
            self.resolution_notes = fake.text()
            self.save()


class ReportAttachmentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ReportAttachment

    report = factory.SubFactory(ReportFactory)

    file = factory.LazyAttribute(
        lambda _: SimpleUploadedFile(
            name="test_attachment.txt",
            content=b"This is a test attachment",
            content_type="text/plain",
        )
    )
    description = factory.Faker("sentence", nb_words=10)
