"""
Serializers for media files and galleries.
"""
from rest_framework import serializers
from .models import MediaFile, Gallery


class MediaFileListSerializer(serializers.ModelSerializer):
    """
    Serializer for media file list.
    """
    file_size_formatted = serializers.CharField(read_only=True)
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = MediaFile
        fields = [
            'id',
            'title',
            'file_url',
            'media_type',
            'file_size',
            'file_size_formatted',
            'file_extension',
            'folder',
            'tags',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_file_url(self, obj):
        """Get file URL."""
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None


class MediaFileDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for media file detail.
    """
    file_size_formatted = serializers.CharField(read_only=True)
    file_url = serializers.SerializerMethodField()
    uploaded_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = MediaFile
        fields = [
            'id',
            'title',
            'description',
            'file_url',
            'media_type',
            'file_name',
            'file_size',
            'file_size_formatted',
            'file_extension',
            'mime_type',
            'width',
            'height',
            'folder',
            'tags',
            'uploaded_by',
            'uploaded_by_name',
            'downloads_count',
            'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'id',
            'file_name',
            'file_size',
            'file_extension',
            'mime_type',
            'width',
            'height',
            'downloads_count',
            'created_at',
            'updated_at'
        ]
    
    def get_file_url(self, obj):
        """Get file URL."""
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None
    
    def get_uploaded_by_name(self, obj):
        """Get uploader name."""
        if obj.uploaded_by:
            return f"{obj.uploaded_by.first_name} {obj.uploaded_by.last_name}"
        return None


class MediaFileUploadSerializer(serializers.ModelSerializer):
    """
    Serializer for uploading media files.
    """
    class Meta:
        model = MediaFile
        fields = [
            'file',
            'title',
            'description',
            'folder',
            'tags',
            'media_type'
        ]
    
    def validate_file(self, value):
        """
        Validate file size (max 50MB).
        """
        max_size = 50 * 1024 * 1024  # 50MB
        if value.size > max_size:
            raise serializers.ValidationError(
                f"La taille du fichier ne peut pas dépasser 50MB."
            )
        return value
    
    def create(self, validated_data):
        """
        Create media file with uploaded_by.
        """
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['uploaded_by'] = request.user
        return super().create(validated_data)


# ──────────────────────────────────────────────
#  Gallery Serializers
# ──────────────────────────────────────────────

class GalleryListSerializer(serializers.ModelSerializer):
    """Serializer for gallery list view with media previews."""
    cover_image_url = serializers.SerializerMethodField()
    photos_count = serializers.SerializerMethodField()
    created_by_name = serializers.SerializerMethodField()
    photo_1_url = serializers.SerializerMethodField()
    photo_2_url = serializers.SerializerMethodField()
    photo_3_url = serializers.SerializerMethodField()
    photo_4_url = serializers.SerializerMethodField()
    photo_5_url = serializers.SerializerMethodField()
    video_url = serializers.SerializerMethodField()

    class Meta:
        model = Gallery
        fields = [
            'id',
            'title',
            'description',
            'gallery_type',
            'cover_image_url',
            'photos_count',
            'photo_1_url',
            'photo_2_url',
            'photo_3_url',
            'photo_4_url',
            'photo_5_url',
            'video_url',
            'is_published',
            'created_by_name',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def _build_url(self, field):
        request = self.context.get('request')
        if field and request:
            return request.build_absolute_uri(field.url)
        return None

    def get_cover_image_url(self, obj):
        request = self.context.get('request')
        if obj.cover_image and request:
            return request.build_absolute_uri(obj.cover_image.url)
        # fallback: first photo
        for i in range(1, 6):
            photo = getattr(obj, f'photo_{i}')
            if photo and request:
                return request.build_absolute_uri(photo.url)
        return None

    def get_photos_count(self, obj):
        return sum(1 for i in range(1, 6) if getattr(obj, f'photo_{i}'))

    def get_created_by_name(self, obj):
        if obj.created_by:
            return f"{obj.created_by.first_name} {obj.created_by.last_name}".strip()
        return None

    def get_photo_1_url(self, obj): return self._build_url(obj.photo_1)
    def get_photo_2_url(self, obj): return self._build_url(obj.photo_2)
    def get_photo_3_url(self, obj): return self._build_url(obj.photo_3)
    def get_photo_4_url(self, obj): return self._build_url(obj.photo_4)
    def get_photo_5_url(self, obj): return self._build_url(obj.photo_5)
    def get_video_url(self, obj): return self._build_url(obj.video)


class GalleryDetailSerializer(serializers.ModelSerializer):
    """Full detail serializer including all photo/video URLs."""
    cover_image_url = serializers.SerializerMethodField()
    photo_1_url = serializers.SerializerMethodField()
    photo_2_url = serializers.SerializerMethodField()
    photo_3_url = serializers.SerializerMethodField()
    photo_4_url = serializers.SerializerMethodField()
    photo_5_url = serializers.SerializerMethodField()
    video_url = serializers.SerializerMethodField()
    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Gallery
        fields = [
            'id',
            'title',
            'description',
            'gallery_type',
            'cover_image_url',
            'photo_1_url',
            'photo_2_url',
            'photo_3_url',
            'photo_4_url',
            'photo_5_url',
            'video_url',
            'is_published',
            'created_by_name',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def _build_url(self, field):
        request = self.context.get('request')
        if field and request:
            return request.build_absolute_uri(field.url)
        return None

    def get_cover_image_url(self, obj): return self._build_url(obj.cover_image)
    def get_photo_1_url(self, obj): return self._build_url(obj.photo_1)
    def get_photo_2_url(self, obj): return self._build_url(obj.photo_2)
    def get_photo_3_url(self, obj): return self._build_url(obj.photo_3)
    def get_photo_4_url(self, obj): return self._build_url(obj.photo_4)
    def get_photo_5_url(self, obj): return self._build_url(obj.photo_5)
    def get_video_url(self, obj): return self._build_url(obj.video)

    def get_created_by_name(self, obj):
        if obj.created_by:
            return f"{obj.created_by.first_name} {obj.created_by.last_name}".strip()
        return None


class ClearableFileField(serializers.FileField):
    """File field that treats an empty string as "remove this file"."""

    def to_internal_value(self, data):
        if data == '':
            return None
        return super().to_internal_value(data)


class ClearableImageField(serializers.ImageField):
    """Image field that treats an empty string as "remove this image"."""

    def to_internal_value(self, data):
        if data == '':
            return None
        return super().to_internal_value(data)


class GalleryCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating/updating a gallery.

    Media fields accept a new upload (replace) or an empty string (remove), so
    a gallery's photos and video can be edited after creation.
    """

    photo_1 = ClearableImageField(required=False, allow_null=True)
    photo_2 = ClearableImageField(required=False, allow_null=True)
    photo_3 = ClearableImageField(required=False, allow_null=True)
    photo_4 = ClearableImageField(required=False, allow_null=True)
    photo_5 = ClearableImageField(required=False, allow_null=True)
    video = ClearableFileField(required=False, allow_null=True)
    cover_image = ClearableImageField(required=False, allow_null=True)

    class Meta:
        model = Gallery
        fields = [
            'title',
            'description',
            'gallery_type',
            'photo_1',
            'photo_2',
            'photo_3',
            'photo_4',
            'photo_5',
            'video',
            'cover_image',
            'is_published',
        ]

    def _final_value(self, attrs, field):
        """Value the field will hold after the update (absent = unchanged)."""
        if field in attrs:
            return attrs[field]
        if self.instance is not None:
            return getattr(self.instance, field, None)
        return None

    def validate(self, attrs):
        instance = getattr(self, 'instance', None)
        gallery_type = attrs.get('gallery_type', instance.gallery_type if instance else 'PHOTOS')

        has_new_photos = any(attrs.get(f'photo_{i}') for i in range(1, 6))
        has_new_video = bool(attrs.get('video'))

        # Account for photos/videos that are being kept, replaced or removed.
        will_have_photos = any(self._final_value(attrs, f'photo_{i}') for i in range(1, 6))
        will_have_video = bool(self._final_value(attrs, 'video'))

        if gallery_type == 'PHOTOS':
            if has_new_video:
                raise serializers.ValidationError(
                    "Vous ne pouvez pas uploader une vidéo pour une galerie de type Photos."
                )
            if not will_have_photos:
                raise serializers.ValidationError(
                    "Vous devez conserver ou uploader au moins une photo."
                )
        elif gallery_type == 'VIDEO':
            if has_new_photos:
                raise serializers.ValidationError(
                    "Vous ne pouvez pas uploader des photos pour une galerie de type Vidéo."
                )
            if not will_have_video:
                raise serializers.ValidationError(
                    "Vous devez uploader une vidéo."
                )
        return attrs

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['created_by'] = request.user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Delete replaced/removed files from storage so they don't linger.
        media_fields = (
            'photo_1', 'photo_2', 'photo_3', 'photo_4', 'photo_5',
            'video', 'cover_image',
        )
        for field in media_fields:
            if field not in validated_data:
                continue
            old_file = getattr(instance, field, None)
            new_file = validated_data[field]
            if old_file and old_file is not new_file:
                old_file.delete(save=False)
        return super().update(instance, validated_data)
