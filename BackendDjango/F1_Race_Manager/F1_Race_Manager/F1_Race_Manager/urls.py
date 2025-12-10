from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('authApp.urls')),  
    path('api/', include('pilots.urls')),
    path('api/', include('circuits.urls')),
    path('api/', include('races.urls')),
    path('api/', include('teams.urls')),
    path('api/incidents/', include('incidents.urls')),
]

