from celery import shared_task
from celery.utils.log import get_task_logger

from apps.emails.models import Email

logger = get_task_logger(__name__)


def _email_send_failure(self, exc, task_id, args, kwargs, einfo):
    email_id = args[0]
    email = Email.objects.get(id=email_id)

    from apps.emails.services import email_failed

    email_failed(email)


@shared_task(bind=True, on_failure=_email_send_failure)
def email_send(self, email_id: int):
    email = Email.objects.get(id=email_id)

    from apps.emails.services import email_send

    try:
        email_send(email)
    except Exception as exc:
        logger.warning(f"Email send failed: {exc}")
        self.retry(exc=exc, countdown=5)
