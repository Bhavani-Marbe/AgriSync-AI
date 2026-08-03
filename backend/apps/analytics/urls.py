from django.urls import path
from .views import UserAnalyticsView

app_name = 'analytics'

urlpatterns = [
    path('analytics/dashboard/', UserAnalyticsView.as_view(), name='analytics-dashboard'),
]
