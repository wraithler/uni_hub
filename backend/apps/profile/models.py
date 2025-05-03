from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Profile(models.Model):
    GENDER_CHOICES = [
        ("M", "Male"),
        ("F", "Female"),
        ("NB", "Non-binary"),
        ("O", "Other"),
        ("P", "Prefer not to say"),
    ]

    YEAR_CHOICES = [
        ("1", "First Year"),
        ("2", "Second Year"),
        ("3", "Third Year"),
    ]

    HOBBY_CHOICES = [
        ("SPORTS", "Sports"),
        ("FILMS", "Films"),
        ("GAMING", "Gaming"),
        ("READING", "Reading"),
        ("MUSIC", "Music"),
        ("TRAVEL", "Travel"),
        ("COOKING", "Cooking"),
        ("AI", "Artificial Intelligence"),
        ("ROBOTICS", "Robotics"),
        ("ALGORITHMS", "Algorithms"),
        ("NATURE", "Nature"),
        ("FRONTEND", "Frontend"),
        ("BACKEND", "Backend"),
    ]

    COURSE_CHOICES = [
        ("CS", "Computer Science"),
        ("LAW", "Law"),
        ("BUSINESS", "Business"),
        ("ENG", "Engineering"),
        ("MED", "Medicine"),
        ("PSY", "Psychology"),
        ("ART", "Art & Design"),
        ("MATH", "Mathematics"),
        ("ARCH", "Architecture"),
        ("DS", "Data Science"),
    ]

    PRONOUN_CHOICES = [
        ("HE/HIM", "He/Him"),
        ("SHE/HER", "She/Her"),
        ("THEY/THEM", "They/Them"),
        ("ASK", "Prefer to be asked"),
        ("NA", "Prefer not to say"),
    ]


    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")

    gender = models.CharField(max_length=2, choices=GENDER_CHOICES, blank=True)

    year_of_study = models.CharField(max_length=1, choices=YEAR_CHOICES, blank=True)

    hobbies = models.CharField(max_length=20, choices=HOBBY_CHOICES, blank=True)

    course = models.CharField(max_length=30, choices=COURSE_CHOICES, blank=True)

    phone_number = models.CharField(max_length=15, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    pronouns = models.CharField(max_length=20, choices=PRONOUN_CHOICES, blank=True)

    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)

    def __str__(self):
        return f"Profile of {self.user.email}"
