from django.core.mail import send_mail
from django.core.signing import TimestampSigner
from django.template.loader import render_to_string

signer = TimestampSigner()

FROM_EMAIL_NO_REPLY = "no-reply@unihub.com"


def send_email_verification(user):
    uid = signer.sign(user.id)
    verification_link = f"http://localhost:3000/verify-email/{uid}"

    context = {
        "verification_link": verification_link,
    }

    email_content = render_to_string("emails/verification-email.html", context)

    send_mail(
        subject="Uni Hub | Email Verification",
        message="",
        from_email=FROM_EMAIL_NO_REPLY,
        recipient_list=[user.email],
        html_message=email_content,
    )
