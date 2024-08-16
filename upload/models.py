from django.db import models

class PDFUpload(models.Model):
    file = models.FileField(upload_to='media/uploads/', null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file.name