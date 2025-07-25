from django.db import models
from django.contrib.auth.models import User

class MemoryEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='memories')  # <-- Add this
    title = models.CharField(max_length=100)
    content = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    color = models.CharField(max_length=7, default="#ffffff", help_text="Hex color of the star")
    x = models.FloatField(help_text="X position for star display")
    y = models.FloatField(help_text="Y position for star display")
    profile_picture = models.CharField(max_length=255, default='avatar1.png')

    def __str__(self):
        return self.title

class MemoryEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='memories', null=True, blank=True)
    title = models.CharField(max_length=100)
    content = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    color = models.CharField(max_length=7, default="#ffffff", help_text="Hex color of the star")
    x = models.FloatField(help_text="X position for star display")
    y = models.FloatField(help_text="Y position for star display")
    # image = models.ImageField(upload_to='memory_images/', null=True, blank=True)  # Optional: to be removed later
    profile_picture = models.CharField(max_length=255, default='avatar1.png')
    is_favorite = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class MemoryImage(models.Model):
    memory = models.ForeignKey(MemoryEntry, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='memory_images/')

    def __str__(self):
        return f"Image for {self.memory.title}"


