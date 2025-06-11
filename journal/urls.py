from django.urls import path
from .views import home, MemoryEntryListCreate

urlpatterns = [
    path('', home, name='home'),
    path('api/memories/', MemoryEntryListCreate.as_view(), name='memory-list-create'),
]
