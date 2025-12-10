from django.urls import path
from . import views

urlpatterns = [
    path('predict/race/<int:race_id>/', views.predict_race_incidents, name='predict_race'),
    path('predict/pilot/<int:pilot_id>/', views.predict_pilot_risk, name='predict_pilot'),
    path('health/', views.health_check, name='health_check'),
]
