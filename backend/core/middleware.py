from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from rest_framework_simplejwt.tokens import AccessToken


class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        token = self.get_token_from_scope(scope)

        if token:
            user_id = await self.get_user_from_token(token)

            if user_id:
                scope["user_id"] = user_id
            else:
                scope["error"] = "Invalid token"
        else:
            scope["error"] = "Auth token must be provided"

        return await super().__call__(scope, receive, send)

    def get_token_from_scope(self, scope):
        headers = dict(scope.get("headers", []))

        auth_header = headers.get(b"Authorization", b"").decode("utf-8")

        if auth_header.startswith("Bearer "):
            return auth_header.split(" ")[1]

    @database_sync_to_async
    def get_user_from_token(self, token):
        try:
            access_token = AccessToken(token)
            return access_token["id"]
        except:
            return None