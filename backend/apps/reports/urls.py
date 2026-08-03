from django.urls import path
from .views import FarmHealthReportView, AgronomicSummaryView

app_name = 'reports'

urlpatterns = [
    path('reports/pdf/', FarmHealthReportView.as_view(), name='report-pdf'),
    path('reports/summary/', AgronomicSummaryView.as_view(), name='report-summary'),
]
