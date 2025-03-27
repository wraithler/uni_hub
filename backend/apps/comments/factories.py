import factory
from apps.comments.models import Comment
from apps.posts.factories import PostFactory
from apps.users.factories import BaseUserFactory

class CommentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Comment
    
    content = factory.Faker("paragraph", nb_sentences=2)
    post = factory.SubFactory(PostFactory)
    created_by = factory.SubFactory(BaseUserFactory)