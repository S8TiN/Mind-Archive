from django.http import JsonResponse
from rest_framework import viewsets
from .models import MemoryEntry
from .serializers import MemoryEntrySerializer

def home(request):
    return JsonResponse({"message": "Welcome to the Mind Archive API 🌌"})

class MemoryEntryViewSet(viewsets.ModelViewSet):
    queryset = MemoryEntry.objects.all()
    serializer_class = MemoryEntrySerializer
