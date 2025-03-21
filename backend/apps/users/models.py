import uuid

from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.models import BaseUserManager as _BaseUserManager
from django.db import models

from apps.common.models import BaseModel


class BaseUserManager(_BaseUserManager):
    def create_user(
        self,
        email,
        username,
        first_name,
        last_name,
        password=None,
        is_active=True,
        is_admin=False,
        is_superuser=False,
        is_staff=False,
    ):
        if not email:
            raise ValueError("Users must have an email address")
        if not username:
            raise ValueError("Users must have a username")
        if not first_name:
            raise ValueError("Users must have a first name")
        if not last_name:
            raise ValueError("Users must have a last name")

        email = self.normalize_email(email)

        user = self.model(
            email=email,
            username=username,
            first_name=first_name,
            last_name=last_name,
            is_active=is_active,
            is_admin=is_admin,
            is_superuser=is_superuser,
            is_staff=is_staff,
        )

        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()

        user.full_clean()
        user.save(using=self._db)

        return user

    def create_superuser(self, username, email, first_name, last_name, password=None):
        user = self.create_user(
            email=email,
            username=username,
            first_name=first_name,
            last_name=last_name,
            password=password,
            is_admin=True,
            is_superuser=True,
            is_staff=True,
        )
        user.save(using=self._db)
        return user


class BaseUser(BaseModel, AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(verbose_name="Email Address", max_length=255, unique=True)
    username = models.CharField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    bio = models.TextField(blank=True, null=True)
    academic_department = models.TextField(blank=True, null=True)
    year_of_study = models.IntegerField(blank=True, null=True)
    profile_picture = models.ImageField(
        upload_to="profile_pictures/", blank=True, null=True
    )

    is_email_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    jwt_key = models.UUIDField(default=uuid.uuid4)

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = [
        "email",
        "first_name",
        "last_name",
    ]  # Required for createsuperuser

    objects = BaseUserManager()

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
