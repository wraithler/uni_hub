from functools import lru_cache
from typing import Dict, Any

import boto3
from attrs import define

from apps.common.utils import assert_settings


@define
class S3Credentials:
    access_key_id: str
    secret_access_key: str
    region_name: str
    bucket_name: str
    default_acl: str
    presigned_expiry: int
    max_size: int


@lru_cache
def s3_get_credentials() -> S3Credentials:
    required_config = assert_settings(
        [
            "AWS_ACCESS_KEY_ID",
            "AWS_SECRET_ACCESS_KEY",
            "AWS_REGION_NAME",
            "AWS_STORAGE_BUCKET_NAME",
            "AWS_DEFAULT_ACL",
            "AWS_PRESIGNED_EXPIRY",
            "FILE_MAX_SIZE",
        ],
        "S3 credentials not found",
    )

    return S3Credentials(
        access_key_id=required_config["AWS_ACCESS_KEY_ID"],
        secret_access_key=required_config["AWS_SECRET_ACCESS_KEY"],
        region_name=required_config["AWS_REGION_NAME"],
        bucket_name=required_config["AWS_STORAGE_BUCKET_NAME"],
        default_acl=required_config["AWS_DEFAULT_ACL"],
        presigned_expiry=required_config["AWS_PRESIGNED_EXPIRY"],
        max_size=required_config["FILE_MAX_SIZE"],
    )


def s3_get_client():
    creds = s3_get_credentials()

    return boto3.client(
        service_name="s3",
        aws_access_key_id=creds.access_key_id,
        aws_secret_access_key=creds.secret_access_key,
        region_name=creds.region_name,
    )


def s3_generate_presigned_post(*, file_path: str, file_type: str) -> Dict[str, Any]:
    creds = s3_get_credentials()
    client = s3_get_client()

    acl = creds.default_acl
    expires_in = creds.presigned_expiry

    presigned_data = client.generate_presigned_post(
        creds.bucket_name,
        file_path,
        Fields={"acl": acl, "Content-Type": file_type},
        Conditions=[
            {"acl": acl},
            {"Content-Type": file_type},
            # As an example, allow file size up to 10 MiB
            # More on conditions, here:
            # https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-HTTPPOSTConstructPolicy.html
            ["content-length-range", 1, creds.max_size],
        ],
        ExpiresIn=expires_in,
    )

    return presigned_data
