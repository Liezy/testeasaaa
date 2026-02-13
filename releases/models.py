from django.db import models
from django.utils import timezone

class Release(models.Model):
    tag = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    body = models.TextField()
    user_notes = models.TextField(blank=True, null=True)
    published_at = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
