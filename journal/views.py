import os
import json
from dotenv import load_dotenv

from django.http import JsonResponse
from rest_framework import viewsets
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.contrib.auth import login
from django.contrib.auth.models import User
from .models import MemoryEntry
from .serializers import MemoryEntrySerializer
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.views.decorators.http import require_GET, require_POST

load_dotenv()

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

@require_GET
@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'message': 'CSRF cookie set'})

# ✅ Final Google login view (no DRF, safe to use)
@csrf_exempt
@require_POST
def google_login(request):
    try:
        data = json.loads(request.body)
        token = data.get("credential")
        if not token:
            return JsonResponse({"error": "Missing token"}, status=400)

        idinfo = id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            os.getenv("GOOGLE_CLIENT_ID")
        )

        email = idinfo["email"]
        username = email.split("@")[0]

        user, created = User.objects.get_or_create(email=email, defaults={"username": username})
        login(request, user)

        return JsonResponse({"message": "Login successful"})

    except ValueError:
        return JsonResponse({"error": "Invalid token"}, status=401)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
