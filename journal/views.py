from django.http import HttpResponse
from rest_framework import viewsets
from .models import MemoryEntry
from .serializers import MemoryEntrySerializer

def home(request):
    return HttpResponse("Welcome to Mind Archive 🌌")

class MemoryEntryViewSet(viewsets.ModelViewSet):
    queryset = MemoryEntry.objects.all()
    serializer_class = MemoryEntrySerializer
