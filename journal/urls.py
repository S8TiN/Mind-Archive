from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import home, MemoryEntryViewSet, user_info, get_csrf_token, google_login  # ✅ added google_login

router = DefaultRouter()
router.register(r'api/memories', MemoryEntryViewSet, basename='memory')

urlpatterns = [
    path('', home, name='home'),
    path('', include(router.urls)),
    path('api/user/', user_info, name='user_info'),
    path('csrf/', get_csrf_token, name='csrf_token'),
    path('api/google-login/', google_login),  #new route for Google login
]
