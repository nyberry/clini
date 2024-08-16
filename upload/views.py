from django.shortcuts import render, redirect
from django.http import JsonResponse
from .forms import PDFUploadForm
from .models import PDFUpload

def upload_pdf(request):
    if request.method == 'POST':
        form = PDFUploadForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'errors': form.errors}, status=400)
    
    return render(request, 'upload/upload.html')


def list_files(request):
    files = PDFUpload.objects.all()
    file_list = [{'name': file.file.name, 'url': file.file.url} for file in files if file.file]
    return JsonResponse({'files': file_list})


def clear_files(request):
    if request.method == 'POST':
        # Delete all files from the database and filesystem
        for file in PDFUpload.objects.all():
            file.file.delete()  # This deletes the file from the filesystem
            file.delete()  # This deletes the record from the database

        return JsonResponse({'success': True})
    return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=400)