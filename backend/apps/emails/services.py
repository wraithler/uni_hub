from django.core.mail import EmailMultiAlternatives
from django.db import transaction

from apps.common.services import model_update
from apps.core.exceptions import ApplicationError
from apps.emails.models import Email


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

    email, _ = model_update(
        instance=email,
        fields=["status", "sent_at"],
        data={"status": Email.Status.SENT, "sent_at": timezone.now()},
    )
    return email
