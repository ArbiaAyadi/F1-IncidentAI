from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CircuitViewSet

# Créer le router
router = DefaultRouter()
router.register(r'circuits', CircuitViewSet, basename='circuit')

urlpatterns = [
    path('', include(router.urls)),
]