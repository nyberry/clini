from django.urls import path
from . import views

urlpatterns = [
    path('', views.upload_pdf, name='upload_pdf'),
    path('files/', views.list_files, name='list_files'),
    path('clear/', views.clear_files, name='clear_files'),
]