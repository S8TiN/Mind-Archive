from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import home, MemoryEntryViewSet, user_info, get_csrf_token  #import the CSRF view

router = DefaultRouter()
router.register(r'api/memories', MemoryEntryViewSet, basename='memory')

urlpatterns = [
    path('', home, name='home'),
    path('', include(router.urls)),
    path('api/user/', user_info, name='user_info'),
    path('csrf/', get_csrf_token, name='csrf_token'),  #CSRF route for frontend to fetch token
]
