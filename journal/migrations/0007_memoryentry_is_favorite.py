# Generated by Django 5.2.3 on 2025-07-18 21:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('journal', '0006_remove_memoryentry_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='memoryentry',
            name='is_favorite',
            field=models.BooleanField(default=False),
        ),
    ]
