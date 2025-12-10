from django.contrib.auth.forms import UserCreationForm
from django.urls import reverse_lazy
from django.views.generic import CreateView, TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin

class SignUpView(CreateView):
    form_class = UserCreationForm
    template_name = 'registration/signup.html'
    success_url = reverse_lazy('login')

class ProfileView(LoginRequiredMixin, PermissionRequiredMixin, TemplateView):
    template_name = 'profile.html'
    permission_required = 'auth.view_user'
