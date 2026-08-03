from django.urls import path
from .views import AdminSystemMetricsView

app_name = 'admin_portal'

urlpatterns = [
    path('admin/system-metrics/', AdminSystemMetricsView.as_view(), name='admin-system-metrics'),
]
