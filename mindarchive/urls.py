from django.contrib import admin
from django.urls import path, include
from .social_urls import GoogleLogin
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.conf import settings
from django.conf.urls.static import static

#CSRF endpoint view
@ensure_csrf_cookie
def get_csrf(request):
    return JsonResponse({'message': 'CSRF cookie set'})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('journal.urls')),

    path('api/', include('dj_rest_auth.urls')),
    path('api/register/', include('dj_rest_auth.registration.urls')),
    path('api/social/login/google/', GoogleLogin.as_view(), name='google_login'),

    #Enables Google login redirection
    path('accounts/', include('allauth.urls')),

    #CSRF endpoint your React app will fetch before login
    path('csrf/', get_csrf),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) #serve uploaded media files