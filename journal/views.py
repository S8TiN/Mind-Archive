from django.http import HttpResponse
from rest_framework import generics
from .models import MemoryEntry
from .serializers import MemoryEntrySerializer

def home(request):
    return HttpResponse("Welcome to Mind Archive 🌌")

class MemoryEntryListCreate(generics.ListCreateAPIView):
    queryset = MemoryEntry.objects.all()
    serializer_class = MemoryEntrySerializer
