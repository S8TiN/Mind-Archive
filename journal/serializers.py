from rest_framework import serializers
from .models import MemoryEntry, MemoryImage

class MemoryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = MemoryImage
        fields = ['id', 'image']

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
        ]

    def create(self, validated_data):
        request = self.context.get('request')
        images = request.FILES.getlist('images') if request else []

        memory = MemoryEntry.objects.create(**validated_data)

        for img in images:
            MemoryImage.objects.create(memory=memory, image=img)

        return memory

