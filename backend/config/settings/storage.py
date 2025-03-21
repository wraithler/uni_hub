import os

from config.env import BASE_DIR, env

USE_S3 = env.bool("USE_S3", default=False)

FILE_MAX_SIZE = env.int("FILE_MAX_SIZE", default=10485760)

if USE_S3:
    DEFAULT_FILE_STORAGE = "storages.backends.s3boto3.S3Boto3Storage"

    AWS_ACCESS_KEY_ID = env("AWS_ACCESS_KEY")
    AWS_SECRET_ACCESS_KEY = env("AWS_SECRET_KEY")
    AWS_STORAGE_BUCKET_NAME = env("AWS_STORAGE_BUCKET_NAME")
    AWS_REGION_NAME = env("AWS_REGION")
    AWS_S3_SIGNATURE_VERSION = env("AWS_SIGNATURE_VERSION", default="s3v4")

    AWS_DEFAULT_ACL = env("AWS_DEFAULT_ACL", default="public-read")

    AWS_PRESIGNED_EXPIRY = env.int("AWS_PRESIGNED_EXPIRY", default=10)

    _AWS_S3_CUSTOM_DOMAIN = env("AWS_S3_CUSTOM_DOMAIN", default=None)

    if _AWS_S3_CUSTOM_DOMAIN:
        AWS_S3_CUSTOM_DOMAIN = _AWS_S3_CUSTOM_DOMAIN
else:
    MEDIA_ROOT_NAME = "media"
    MEDIA_ROOT = os.path.join(BASE_DIR, MEDIA_ROOT_NAME)
    MEDIA_URL = "/media/"
