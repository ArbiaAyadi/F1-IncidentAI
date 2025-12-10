from django.contrib import admin
from .models import Circuit

@admin.register(Circuit)
class CircuitAdmin(admin.ModelAdmin):
    list_display = ['nom', 'pays', 'type_circuit', 'longueur', 'nombre_tours', 'actif']
    list_filter = ['type_circuit', 'actif', 'pays']
    search_fields = ['nom', 'pays', 'ville']
