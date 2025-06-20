from django.db import models

class MemoryEntry(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    color = models.CharField(max_length=7, default="#ffffff", help_text="Hex color of the star")
    x = models.FloatField(help_text="X position for star display")
    y = models.FloatField(help_text="Y position for star display")

    def __str__(self):
        return self.title

