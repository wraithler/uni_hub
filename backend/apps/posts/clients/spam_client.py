import requests

from config.env import env


class SpamDetectionClient:
    def __init__(self, base_url=env.str("SPAM_SERVICE_URL")):
        self.base_url = base_url

    def check_spam(self, text: str):
        response = requests.post(
            f"{self.base_url}/check-spam/",
            json={
                "text": text,
            },
        )

        return response.json()

client = SpamDetectionClient()

def is_spam(text: str) -> bool:
    return client.check_spam(text)["spam"]

