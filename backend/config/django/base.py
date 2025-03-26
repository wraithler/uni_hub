import os

from config.env import BASE_DIR, APPS_DIR, env

env.read_env(os.path.join(BASE_DIR, ".env"))

# See https://docs.djangoproject.com/en/3.0/howto/deployment/checklist/
SECRET_KEY = env("SECRET_KEY")  # WARNING: ALWAYS KEEP SECRET
DEBUG = env.bool("DJANGO_DEBUG", default=True)  # WARNING: ALWAYS FALSE IN PRODUCTION
ALLOWED_HOSTS = ["*"]  # WARNING: NEVER WILDCARD IN PRODUCTION

LOCAL_APPS = [
    "apps.common.apps.CommonConfig",
    "apps.authentication.apps.AuthenticationConfig",
    "apps.api.apps.ApiConfig",
    "apps.users.apps.UsersConfig",
    "apps.tasks.apps.TasksConfig",
    "apps.communities.apps.CommunitiesConfig",
    "apps.emails.apps.EmailsConfig",
    "apps.core.apps.CoreConfig",
    "apps.events.apps.EventsConfig",
    "apps.files.apps.FilesConfig",
    "apps.posts.apps.PostsConfig",
    "apps.feedback.apps.FeedbackConfig",
    "apps.friends.apps.FriendsConfig",
    "apps.comments.apps.CommentsConfig",
]  # TODO: Add others

THIRD_PARTY_APPS = [
    "rest_framework",
    "django_celery_results",
    "django_celery_beat",
    "django_filters",
    "corsheaders",
    "django_extensions",
    "rest_framework_simplejwt",
    "storages",
]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "whitenoise.runserver_nostatic",
    "django.contrib.staticfiles",
    *THIRD_PARTY_APPS,
    *LOCAL_APPS,
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(APPS_DIR, "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": env("POSTGRES_NAME"),
        "USER": env("POSTGRES_USER"),
        "PASSWORD": env("POSTGRES_PASSWORD"),
        "HOST": env("POSTGRES_HOST"),
        "PORT": env("POSTGRES_PORT"),
    }
}
DATABASES["default"]["ATOMIC_REQUESTS"] = True

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


AUTH_USER_MODEL = "users.BaseUser"

# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/

LANGUAGE_CODE = env("DJANGO_LANGUAGE_CODE")
TIME_ZONE = env("DJANGO_TIME_ZONE")
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
STATIC_URL = "/static/"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

REST_FRAMEWORK = {
    "EXCEPTION_HANDLER": "apps.api.exception_handlers.drf_default_with_modifications_exception_handler",
    "DEFAULT_FILTER_BACKENDS": ("django_filters.rest_framework.DjangoFilterBackend",),
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}

APP_DOMAIN = env("APP_DOMAIN", default="http://localhost:3001")

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

FIXTURE_DIRS = [os.path.join(BASE_DIR, "config", "fixtures")]

# Import settings from other files

from config.settings.celery import *  # noqa
from config.settings.cors import *  # noqa
from config.settings.emails import *  # noqa
from config.settings.jwt import *  # noqa
from config.settings.storage import *  # noqa
from config.settings.sentry import *  # noqa
from config.settings.sessions import *  # noqa
from config.settings.logging import *  # noqa
