from django.urls import path
from .views import MarketViewSet

app_name = 'market'

urlpatterns = [
    path('market/commodities/', MarketViewSet.as_view({'get': 'list'}), name='market-commodities'),
    path('market/revenue-forecast/', MarketViewSet.as_view({'post': 'revenue_forecast'}), name='market-revenue-forecast'),
]
