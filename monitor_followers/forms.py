from django import forms

class UsernameForm(forms.Form):
    q = forms.CharField(
        label='Usernames',
        widget=forms.TextInput(
            attrs = {
                'class': 'validate'
            }
        )
    )