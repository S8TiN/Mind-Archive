import os
import json
from dotenv import load_dotenv

from django.http import JsonResponse
from rest_framework import viewsets, generics
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.contrib.auth import login
from django.contrib.auth.models import User
from .models import MemoryEntry, MemoryImage
from .serializers import MemoryEntrySerializer, MemoryImageSerializer
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.views.decorators.http import require_GET, require_POST
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.core.mail import send_mail
from django.utils.crypto import get_random_string

load_dotenv()

def home(request):
    return JsonResponse({"message": "Welcome to the Mind Archive API 🌌"})

class MemoryEntryViewSet(viewsets.ModelViewSet):
    queryset = MemoryEntry.objects.all()
    serializer_class = MemoryEntrySerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser] 

    def perform_create(self, serializer):
        memory = serializer.save()
        images = self.request.FILES.getlist('images')  # this expects form field name to be "images"
        for image in images:
            MemoryImage.objects.create(memory=memory, image=image)
    
    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)

        # Save any newly uploaded image file(s)
        memory = self.get_object()
        new_images = request.FILES.getlist('image')  # field name from frontend

        for image in new_images:
            MemoryImage.objects.create(memory=memory, image=image)

        return response


@login_required
def user_info(request):
    user = request.user
    social = user.socialaccount_set.first()
    picture = social.get_avatar_url() if social else None

    return JsonResponse({
        "username": user.username,
        "email": user.email,
        "picture": picture
    })

@require_GET
@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'message': 'CSRF cookie set'})

# ✅ Final Google login view (with profile picture)
@csrf_exempt
@require_POST
def google_login(request):
    try:
        data = json.loads(request.body)
        token = data.get("credential")
        if not token:
            return JsonResponse({"error": "Missing token"}, status=400)

        # Verify Google token
        idinfo = id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            os.getenv("GOOGLE_CLIENT_ID")
        )

        # Extract user info
        email = idinfo["email"]
        name = idinfo.get("name", email.split("@")[0])
        picture = idinfo.get("picture")  # ✅ profile image

        # Create or get the user
        user, created = User.objects.get_or_create(
            email=email,
            defaults={"username": email.split("@")[0]}
        )
        login(request, user)

        return JsonResponse({
            "token": "session",  # placeholder
            "user": {
                "name": name,
                "email": email,
                "picture": picture
            }
        })

    except ValueError:
        return JsonResponse({"error": "Invalid token"}, status=401)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
@csrf_exempt
@require_POST
def register_user(request):
    try:
        data = json.loads(request.body)

        username = data.get("username")
        password = data.get("password")
        profile_picture = data["profile_picture"]

        if not username or not password:
            return JsonResponse({"error": "Username and password are required"}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Username already taken"}, status=400)

        user = User.objects.create_user(username=username, password=password)
        user.profile_picture = profile_picture  # ✅ make sure this field exists
        user.save()

        login(request, user)

        return JsonResponse({
            "token": "session",
            "user": {
                "username": user.username,
                "profile_picture": user.profile_picture
            }
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
class MemoryImageDeleteView(generics.DestroyAPIView):
    queryset = MemoryImage.objects.all()
    serializer_class = MemoryImageSerializer

@csrf_exempt
def send_password_reset_email(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        try:
            user = User.objects.get(email=email)
            # Generate a fake token and link (replace with real logic later)
            token = get_random_string(length=32)
            reset_link = f"http://localhost:3000/reset-password/{token}"

            send_mail(
                'Password Reset Request',
                f'Click the link to reset your password: {reset_link}',
                'noreply@mindarchive.com',
                [email],
                fail_silently=False,
            )
            return JsonResponse({'message': 'Password reset email sent.'}, status=200)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found.'}, status=404)
    return JsonResponse({'error': 'Invalid request'}, status=400)