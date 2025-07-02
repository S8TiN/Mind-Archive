from django.contrib import admin
from .models import MemoryEntry, MemoryImage

class MemoryImageInline(admin.TabularInline):
    model = MemoryImage
    extra = 0

class MemoryEntryAdmin(admin.ModelAdmin):
    inlines = [MemoryImageInline]

admin.site.register(MemoryEntry, MemoryEntryAdmin)
admin.site.register(MemoryImage)  # Optional if you want standalone view
