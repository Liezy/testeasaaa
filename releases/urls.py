
from django.urls import path
from . import views

urlpatterns = [
	path('', views.list_releases, name='list_releases'),
	path('latest/', views.latest_release, name='latest_release'),
	path('sync/', views.sync_release, name='sync_release'),
	path('changelog/', views.changelog, name='changelog'),
]
