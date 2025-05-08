from html import unescape

from celery.utils.log import get_task_logger
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMultiAlternatives, send_mail
from django.db import transaction
from django.db.models import QuerySet
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

from apps.common.services import model_update
from apps.core.exceptions import ApplicationError
from apps.emails.models import Email
from apps.emails.tasks import email_send as email_send_task
from apps.users.models import BaseUser
from apps.notifications.models import Notification

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

    html = unescape(email.html)
    plain_text = email.plain_text

    send_mail(subject, plain_text, from_email, [to], html_message=html)

    msg = EmailMultiAlternatives(
        subject,
        plain_text,
        from_email,
        [to],
        headers={"List-Unsubscribe": "<mailto:unsub@unihub.com>"},
    )
    msg.attach_alternative(html, "text/html")

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

        transaction.on_commit(
            (lambda email_id: lambda: email_send_task.delay(email_id))(email.id)
        )


def verification_email_create(user: BaseUser) -> Email:
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))

    link = f"http://localhost:3000/verification-email/verify/{uid}/{token}"  # TODO: Change to environment variable

    html = render_to_string(
        "emails/verification-email.html", {"verification_link": link}
    )

    email = Email.objects.create(
        to=user.email,
        subject="Verify your email",
        html=html,
        plain_text="Verify your email at " + link,
        status=Email.Status.SENDING,
    )

    transaction.on_commit(
        (lambda email_id: lambda: email_send_task.delay(email_id))(email.id)
    )
    return email


def send_notification_email(notification: Notification) -> Email:
    """
    Send a notification via email using the notification template.
    """
    # Render the email template
    html = render_to_string(
        "emails/notifications-email.html", {"notification": notification}
    )

    # Create email record
    email = Email.objects.create(
        to=notification.recipient.email,
        subject=notification.title,
        html=html,
        plain_text=notification.message,
        status=Email.Status.SENDING,
    )

    # Send email asynchronously
    email_send_task.delay(email.id)

    return email
