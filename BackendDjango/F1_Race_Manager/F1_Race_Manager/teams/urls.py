from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeamViewSet, TeamPilotViewSet

router = DefaultRouter()
router.register(r'teams', TeamViewSet, basename='team')
router.register(r'team-pilots', TeamPilotViewSet, basename='team-pilot')

urlpatterns = [
    path('', include(router.urls)),
]
