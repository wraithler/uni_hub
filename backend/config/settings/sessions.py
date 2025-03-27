from config.env import env

# TODO: Check for production

SESSION_COOKIE_AGE = env.int("SESSION_COOKIE_AGE", default=1209600)
SESSION_COOKIE_HTTPONLY = env.bool("SESSION_COOKIE_HTTPONLY", default=True)
SESSION_COOKIE_NAME = env("SESSION_COOKIE_NAME", default="sessionid")
SESSION_COOKIE_SAMESITE = env("SESSION_COOKIE_SAMESITE", default="Lax")
SESSION_COOKIE_SECURE = env.bool("SESSION_COOKIE_SECURE", default=False)

CSRF_USE_SESSIONS = env.bool("CSRF_USE_SESSIONS", default=True)
