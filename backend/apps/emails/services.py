from celery.utils.log import get_task_logger
from django.core.mail import EmailMultiAlternatives
from django.db import transaction
from django.db.models import QuerySet
from django.utils import timezone

from apps.common.services import model_update
from apps.core.exceptions import ApplicationError
from apps.emails.models import Email
from apps.emails.tasks import email_send as email_send_task
from config.env import env

logger = get_task_logger(__name__)

@transaction.atomic
def email_failed(email: Email) -> Email:
    if email.status != Email.Status.SENDING:
        raise ApplicationError(
            "Emails must be in SENDING status to be marked as FAILED"
        )

    email, _ = model_update(
        instance=email, fields=["status"], data={"status": Email.Status.FAILED}
    )
    return email


@transaction.atomic
def email_send(email: Email) -> Email:
    if email.status != Email.Status.SENDING:
        raise ApplicationError(
            f"Emails must be in SENDING status to be marked as SENT, current status is {email.status}"
        )

    subject = email.subject
    from_email = "mail@unihub.com"
    to = email.to

    html = email.html
    plain_text = email.plain_text

    msg = EmailMultiAlternatives(subject, plain_text, from_email, [to])
    msg.attach(html, "text/html")

    msg.send()

    email, _ = model_update(
        instance=email,
        fields=["status", "sent_at"],
        data={"status": Email.Status.SENT, "sent_at": timezone.now()},
    )
    return email


def email_send_all(emails: QuerySet[Email]) -> None:
    for email in emails:
        with transaction.atomic():
            Email.objects.filter(id=email.id).update(status=Email.Status.SENDING)

        transaction.on_commit((lambda email_id: lambda: email_send_task.delay(email_id))(email.id))