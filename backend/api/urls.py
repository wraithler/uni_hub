from django.urls import path
from .views import Home, RegisterView, LoginView

urlpatterns = [
    path("", Home.as_view()),
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
]
