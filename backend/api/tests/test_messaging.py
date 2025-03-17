from channels.testing import WebsocketCommunicator
from django.test import TestCase

from api.factories import UserFactory
from core.asgi import application


class ChatTestCase(TestCase):
    def setUp(self):
        self.user1, self.user2 = UserFactory.create_batch(2)
        self.chat_id = 1

    async def connect_to_chat(self, user):
        communicator = WebsocketCommunicator(
            application, f"ws/private_chat/{self.chat_id}/"
        )
        connected, subprotocol = await communicator.connect()

        self.assertTrue(connected)
        print("Connected")
        return communicator

    async def test_private_chat(self):
        communicator1 = await self.connect_to_chat(self.user1)
        communicator2 = await self.connect_to_chat(self.user2)

        message_to_send = {"message": "Hello from User1!", "type": "message"}
        await communicator1.send_json_to(message_to_send)

        response = await communicator2.receive_json_from()
        self.assertEqual(response["message"], "Hello from User1!")

        await communicator1.disconnect()
        await communicator2.disconnect()
