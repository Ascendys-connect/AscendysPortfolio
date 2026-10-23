"""
Models for media library.
"""
import os
from django.db import models
from django.core.validators import FileExtensionValidator
from apps.core.models import TimeStampedModel, UUIDModel



def media_upload_path(instance, filename):
    """
    Generate upload path for media files.
    """
    ext = filename.split('.')[-1]
    return f'media/{instance.media_type}/{instance.id}.{ext}'


class MediaFile(UUIDModel, TimeStampedModel):
    """
    Model for media files (images, documents, videos).
    """
    MEDIA_TYPE_CHOICES = [
        ('IMAGE', 'Image'),
        ('DOCUMENT', 'Document'),
        ('VIDEO', 'Vidéo'),
        ('AUDIO', 'Audio'),
        ('OTHER', 'Autre'),
    ]
    
    # File info
    title = models.CharField(max_length=200, verbose_name="Titre")
    description = models.TextField(blank=True, verbose_name="Description")
    file = models.FileField(
        upload_to=media_upload_path,
        verbose_name="Fichier"
    )
    media_type = models.CharField(
        max_length=20,
        choices=MEDIA_TYPE_CHOICES,
        verbose_name="Type de média"
    )
    
    # Metadata
    file_name = models.CharField(max_length=255, verbose_name="Nom du fichier")
    file_size = models.PositiveIntegerField(verbose_name="Taille (octets)")
    file_extension = models.CharField(max_length=10, verbose_name="Extension")
    mime_type = models.CharField(max_length=100, blank=True, verbose_name="Type MIME")
    
    # Image specific
    width = models.PositiveIntegerField(null=True, blank=True, verbose_name="Largeur")
    height = models.PositiveIntegerField(null=True, blank=True, verbose_name="Hauteur")
    
    # Organization
    folder = models.CharField(
        max_length=200,
        blank=True,
        verbose_name="Dossier"
    )
    tags = models.JSONField(
        default=list,
        blank=True,
        verbose_name="Tags"
    )
    
    # Tracking
    uploaded_by = models.ForeignKey(
        'accounts.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='uploaded_media',
        verbose_name="Uploadé par"
    )
    downloads_count = models.PositiveIntegerField(
        default=0,
        verbose_name="Nombre de téléchargements"
    )
    
    class Meta:
        verbose_name = "Fichier média"
        verbose_name_plural = "Fichiers média"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['media_type']),
            models.Index(fields=['folder']),
        ]
    
    def __str__(self):
        return self.title or self.file_name
    
    def save(self, *args, **kwargs):
        """
        Override save to extract file metadata.
        """
        if self.file:
            # Extract file name and extension
            self.file_name = os.path.basename(self.file.name)
            self.file_extension = os.path.splitext(self.file_name)[1].lower().replace('.', '')
            
            # Get file size
            if hasattr(self.file, 'size'):
                self.file_size = self.file.size
            
            # Auto-detect media type based on extension
            if not self.media_type:
                self.media_type = self._detect_media_type()
            
            # Extract image dimensions if it's an image
            if self.media_type == 'IMAGE' and not self.width:
                self._extract_image_dimensions()
        
        super().save(*args, **kwargs)
    
    def _detect_media_type(self):
        """
        Auto-detect media type based on file extension.
        """
        image_exts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp']
        document_exts = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt']
        video_exts = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm']
        audio_exts = ['mp3', 'wav', 'ogg', 'flac', 'm4a']
        
        ext = self.file_extension.lower()
        
        if ext in image_exts:
            return 'IMAGE'
        elif ext in document_exts:
            return 'DOCUMENT'
        elif ext in video_exts:
            return 'VIDEO'
        elif ext in audio_exts:
            return 'AUDIO'
        else:
            return 'OTHER'
    
    def _extract_image_dimensions(self):
        """
        Extract image width and height.
        """
        try:
            from PIL import Image
            img = Image.open(self.file)
            self.width, self.height = img.size
        except Exception:
            pass
    
    def increment_downloads(self):
        """
        Increment downloads counter.
        """
        self.downloads_count += 1
        self.save(update_fields=['downloads_count'])
    
    @property
    def file_size_formatted(self):
        """
        Return formatted file size.
        """
        size = self.file_size
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024.0:
                return f"{size:.2f} {unit}"
            size /= 1024.0
        return f"{size:.2f} TB"


class Gallery(UUIDModel, TimeStampedModel):
    """
    Model for media gallery (photos or single video).
    A gallery represents a collection of up to 5 photos OR one video.
    """
    GALLERY_TYPE_CHOICES = [
        ('PHOTOS', 'Photos'),
        ('VIDEO', 'Vidéo'),
    ]

    title = models.CharField(max_length=200, verbose_name="Titre")
    description = models.TextField(verbose_name="Description")
    gallery_type = models.CharField(
        max_length=10,
        choices=GALLERY_TYPE_CHOICES,
        default='PHOTOS',
        verbose_name="Type de galerie"
    )

    # Photos (up to 5, only used when gallery_type == PHOTOS)
    photo_1 = models.ImageField(
        upload_to='galleries/photos/',
        blank=True, null=True,
        verbose_name="Photo 1"
    )
    photo_2 = models.ImageField(
        upload_to='galleries/photos/',
        blank=True, null=True,
        verbose_name="Photo 2"
    )
    photo_3 = models.ImageField(
        upload_to='galleries/photos/',
        blank=True, null=True,
        verbose_name="Photo 3"
    )
    photo_4 = models.ImageField(
        upload_to='galleries/photos/',
        blank=True, null=True,
        verbose_name="Photo 4"
    )
    photo_5 = models.ImageField(
        upload_to='galleries/photos/',
        blank=True, null=True,
        verbose_name="Photo 5"
    )

    # Video (only used when gallery_type == VIDEO)
    video = models.FileField(
        upload_to='galleries/videos/',
        blank=True, null=True,
        validators=[FileExtensionValidator(allowed_extensions=['mp4', 'webm', 'mov', 'avi'])],
        verbose_name="Vidéo"
    )

    # Cover image (thumbnail for listing)
    cover_image = models.ImageField(
        upload_to='galleries/covers/',
        blank=True, null=True,
        verbose_name="Image de couverture"
    )

    is_published = models.BooleanField(default=False, verbose_name="Publié")

    created_by = models.ForeignKey(
        'accounts.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='galleries_created',
        verbose_name="Créé par"
    )

    class Meta:
        verbose_name = "Galerie"
        verbose_name_plural = "Galeries"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['is_published']),
        ]

    def __str__(self):
        return self.title

    def get_photos(self):
        """Return list of non-null photo URLs."""
        photos = []
        for i in range(1, 6):
            photo = getattr(self, f'photo_{i}')
            if photo:
                photos.append(photo)
        return photos
