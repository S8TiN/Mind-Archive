# serializers.py
from rest_framework import serializers
from .models import MemoryEntry, MemoryImage

class MemoryImageSerializer(serializers.ModelSerializer):
    # Always return an absolute URL (Cloudinary will already be absolute;
    # local/storage paths like "/media/..." get prefixed with the API origin)
    image = serializers.SerializerMethodField()

    class Meta:
        model = MemoryImage
        fields = ['id', 'image']

    def get_image(self, obj):
        if not obj.image:
            return ''
        url = obj.image.url  # FileField/ImageField .url
        if url.startswith('http'):
            return url
        request = self.context.get('request')
        return request.build_absolute_uri(url) if request else url


class MemoryEntrySerializer(serializers.ModelSerializer):
    images = MemoryImageSerializer(many=True, read_only=True)

    class Meta:
        model = MemoryEntry
        fields = [
            'id',
            'title',
            'content',
            'date_created',
            'color',
            'x',
            'y',
            'profile_picture',
            'images',
            'is_favorite',
            'user',
        ]
        read_only_fields = ['user']
