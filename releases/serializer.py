from rest_framework import serializers
from .models import Release

class ReleaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Release
        fields = "__all__"
        read_only_fields = ["published_at"]