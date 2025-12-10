from django.contrib import admin
from .models import Pilote

@admin.register(Pilote)
class PiloteAdmin(admin.ModelAdmin):
    list_display = ['nom', 'equipe', 'nationalite', 'age', 'victoires', 'podiums']
    list_filter = ['equipe', 'nationalite']
    search_fields = ['nom', 'equipe', 'nationalite']
    ordering = ['-victoires']
