# mindarchive/urls.py
from django.contrib import admin
from django.urls import path, include
from .social_urls import GoogleLogin  

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('journal.urls')),

    path('api/', include('dj_rest_auth.urls')),   # login, logout, user info
    path('api/register/', include('dj_rest_auth.registration.urls')),  # registration

    path('api/social/login/google/', GoogleLogin.as_view(), name='google_login'),  
]
