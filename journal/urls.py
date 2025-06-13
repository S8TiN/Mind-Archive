from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import home, MemoryEntryViewSet

router = DefaultRouter()
router.register(r'api/memories', MemoryEntryViewSet, basename='memory')

urlpatterns = [
    path('', home, name='home'),
    path('', include(router.urls)),
]
