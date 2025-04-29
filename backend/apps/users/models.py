from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import BaseUserManager as _BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.db import models

from apps.common.models import BaseModel


class BaseUserManager(_BaseUserManager):
    def create_user(
        self,
        email,
        first_name,
        last_name,
        password=None,
        is_active=True,
        is_superuser=False,
    ):
        if not email:
            raise ValueError("Users must have an email address")
        if not first_name:
            raise ValueError("Users must have a first name")
        if not last_name:
            raise ValueError("Users must have a last name")

        email = self.normalize_email(email)

        user = self.model(
            email=email,
            first_name=first_name,
            last_name=last_name,
            is_active=is_active,
            is_superuser=is_superuser,
        )

        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()

        user.full_clean()
        user.save(using=self._db)

        return user

    def create_superuser(self, email, first_name, last_name, password=None):
        user = self.create_user(
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=password,
            is_superuser=True,
        )
        user.save(using=self._db)
        return user


class BaseUser(BaseModel, AbstractBaseUser, PermissionsMixin):
    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

    objects = BaseUserManager()
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = [
        "first_name",
        "last_name",
    ]  # Required for createsuperuser

    email = models.EmailField(verbose_name="Email Address", max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)

    bio = models.TextField(blank=True, null=True)
    academic_department = models.TextField(blank=True, null=True)
    year_of_study = models.IntegerField(blank=True, null=True)

    profile_picture = models.ForeignKey(
        "files.File", on_delete=models.SET_NULL, null=True, blank=True, related_name="profile"
    )
    banner_picture = models.ForeignKey(
        "files.File", on_delete=models.SET_NULL, null=True, blank=True, related_name="banner"
    )

    ROLE_OPTIONS = (
        ("student", "Student"),
        ("faculty", "Faculty"),
        ("admin", "Admin"),
    )

    role = models.CharField(
        max_length=10,
        choices=ROLE_OPTIONS,
        default="student",
    )
    is_email_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(
        default=True
    )  # (opposite of suspended for test cases)
    is_superuser = models.BooleanField(default=False)
