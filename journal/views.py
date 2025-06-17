from django.http import JsonResponse
from rest_framework import viewsets
from .models import MemoryEntry
from .serializers import MemoryEntrySerializer
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_GET

def home(request):
    return JsonResponse({"message": "Welcome to the Mind Archive API 🌌"})

class MemoryEntryViewSet(viewsets.ModelViewSet):
    queryset = MemoryEntry.objects.all()
    serializer_class = MemoryEntrySerializer

@login_required
def user_info(request):
    user = request.user
    return JsonResponse({
        "username": user.username,
        "email": user.email,
    })

#CSRF token view for React frontend
@require_GET
@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'message': 'CSRF cookie set'})
