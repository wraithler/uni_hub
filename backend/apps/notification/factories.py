import factory
from apps.notifications.models import Notification
from apps.users.models import BaseUser  

class NotificationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Notification

    user = factory.SubFactory(BaseUser)  
    title = factory.Faker("sentence", nb_words=4)  
    message = factory.Faker("text")  
    is_read = factory.Faker("boolean")  
    is_important = factory.Faker("boolean") 
    is_anonymous = factory.Faker("boolean")  
    notification_type = factory.Faker("random_element", elements=[
        Notification.NotificationType.INFO,
        Notification.NotificationType.WARNING,
        Notification.NotificationType.ERROR,
        Notification.NotificationType.SUCCESS
    ])  
    created_at = factory.Faker("date_time_this_year")  
    updated_at = factory.Faker("date_time_this_year")  
