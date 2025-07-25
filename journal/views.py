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
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str

load_dotenv()

def home(request):
    return JsonResponse({"message": "Welcome to the Mind Archive API 🌌"})

class MemoryEntryViewSet(viewsets.ModelViewSet):
    serializer_class = MemoryEntrySerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser] 

    def get_queryset(self):
        return MemoryEntry.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        memory = serializer.save(user=self.request.user)
        images = self.request.FILES.getlist('images')  # expects field name to be "images"
        for image in images:
            MemoryImage.objects.create(memory=memory, image=image)

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)

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
@require_POST
def password_reset_request(request):
    try:
        data = json.loads(request.body)
        email = data.get("email")

        if not email:
            return JsonResponse({"error": "Email is required."}, status=400)

        user = User.objects.filter(email=email).first()
        if not user:
            return JsonResponse({"error": "No user found with this email."}, status=404)

        # Generate UID and secure token
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        # Link to your frontend reset form
        reset_link = f"http://localhost:3000/reset-password/{uid}/{token}"

        # Send reset link by email
        send_mail(
            subject='Reset your password',
            message=f"Hi {user.username},\n\nClick the link below to reset your password:\n\n{reset_link}",
            from_email='noreply@mindarchive.com',
            recipient_list=[email],
            fail_silently=False,
        )

        return JsonResponse({"message": "Password reset email sent."})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JsonResponse({"error": str(e)}, status=500)
    
@csrf_exempt
@require_POST
def password_reset_confirm(request, uidb64, token):
    try:
        data = json.loads(request.body)
        new_password = data.get("password")

        if not new_password:
            return JsonResponse({"error": "New password is required."}, status=400)

        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)

        if not default_token_generator.check_token(user, token):
            return JsonResponse({"error": "Invalid or expired token."}, status=400)

        user.set_password(new_password)
        user.save()

        return JsonResponse({"message": "Password has been reset successfully."})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JsonResponse({"error": str(e)}, status=500)