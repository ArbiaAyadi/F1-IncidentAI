from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RaceStrategyViewSet, SeasonViewSet, RaceViewSet, RaceResultViewSet, ChampionshipViewSet

router = DefaultRouter()
router.register(r'seasons', SeasonViewSet, basename='season')
router.register(r'races', RaceViewSet, basename='race')
router.register(r'results', RaceResultViewSet, basename='result')
router.register(r'championship', ChampionshipViewSet, basename='championship')
router.register(r'strategies', RaceStrategyViewSet, basename='strategy')

urlpatterns = [
    path('', include(router.urls)),
]

