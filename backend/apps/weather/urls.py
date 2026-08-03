from django.urls import path
from .views import WeatherViewSet

app_name = 'weather'

urlpatterns = [
    path('weather/', WeatherViewSet.as_view({'get': 'list'}), name='weather-current'),
    path('weather/alerts/', WeatherViewSet.as_view({'get': 'alerts'}), name='weather-alerts'),
]
