from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .serializer import ReleaseSerializer
from .models import Release
from django.shortcuts import render
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist

def home(request):
    return render(request, 'home.html')

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def sync_release(request):
    serializer = ReleaseSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(status=201)

@api_view(["GET"])
@permission_classes([AllowAny])
def latest_release(request):
    try:
        release = Release.objects.latest("published_at")
        return Response(ReleaseSerializer(release).data)
    except Release.DoesNotExist:
        return Response({"detail": "Nenhum release encontrado."}, status=status.HTTP_404_NOT_FOUND)

@api_view(["GET"])
@permission_classes([AllowAny])
def list_releases(request):
    qs = Release.objects.order_by("-published_at")
    return Response(ReleaseSerializer(qs, many=True).data)
