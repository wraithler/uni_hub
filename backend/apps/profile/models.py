from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Profile(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('NB', 'Non-binary'),
        ('O', 'Other'),
        ('P', 'Prefer not to say'),
    ]

    HOBBY_CHOICES = [
        ('SPORTS', 'Sports'),
        ('FILMS', 'Films'),
        ('GAMING', 'Gaming'),
        ('READING', 'Reading'),
        ('MUSIC', 'Music'),
        ('TRAVEL', 'Travel'),
        ('COOKING', 'Cooking'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    

    gender = models.CharField(max_length=2, choices=GENDER_CHOICES, blank=True)

    hobbies = models.CharField(
        max_length=20,
        choices=HOBBY_CHOICES,
        blank=True
    )

    bio = models.TextField(blank=True)
    
    website_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)

    

    def __str__(self):
        return f"Profile of {self.user.email}"
