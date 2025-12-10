from .views import PiloteViewSet, register  
from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'pilotes', PiloteViewSet)

urlpatterns = [
    path('register/', register, name='register'),
    path('', include(router.urls)),
]

