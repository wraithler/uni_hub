from django import forms
from apps.users.models import BaseUser  # Ensure this path is correct

class BaseUserForm(forms.ModelForm):
    class Meta:
        model = BaseUser
        fields = '__all__'

    def clean_username(self):
        username = self.cleaned_data.get("username")
        if " " in username:
            raise forms.ValidationError("Username cannot contain spaces")
        return username