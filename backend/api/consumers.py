import json

from channels.generic.websocket import AsyncWebsocketConsumer


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        self.chat_id = self.scope["url_route"]["kwargs"]["chat_id"]
        self.room_group_name = f"private_chat_{self.chat_id}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        message_type = data.get("type")

        if message_type == "message":
            message = data.get("message")
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message": message,
                    "sender": self.user.username
                }
            )
        elif message_type == "typing":
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_typing",
                    "sender": self.user.username
                }
            )

    async def chat_message(self, event):
        await self.send(
            text_data=json.dumps({
                "type": "message",
                "message": event["message"],
                "sender": event["sender"]
            })
        )

    async def user_typing(self, event):
        await self.send(
            text_data=json.dumps({
                "type": "typing",
                "sender": event["sender"]
            })
        )