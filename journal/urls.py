from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import home, MemoryEntryViewSet, MemoryImageDeleteView, user_info, get_csrf_token, google_login, register_user, password_reset_request, password_reset_confirm
from journal.views import password_reset_request

router = DefaultRouter()
router.register(r'api/memories', MemoryEntryViewSet, basename='memory')

urlpatterns = [
    path('', home, name='home'),
    path('', include(router.urls)),
    path('api/user/', user_info, name='user_info'),
    path('csrf/', get_csrf_token, name='csrf_token'),
    path('api/google-login/', google_login),
    path('api/register/', register_user, name='register_user'),
    path('api/images/<int:pk>/', MemoryImageDeleteView.as_view(), name='delete-memory-image'),
    path('api/password-reset/', password_reset_request, name='password-reset'),
    path('api/password-reset-confirm/<uidb64>/<token>/', password_reset_confirm, name='password_reset_confirm'),
]
