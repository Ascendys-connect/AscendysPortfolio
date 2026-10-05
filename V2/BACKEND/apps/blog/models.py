"""
Blog models for articles, categories, and tags.
"""
from django.db import models
from django.utils.text import slugify
from django.contrib.auth import get_user_model
from apps.core.models import UUIDModel, TimeStampedModel, PublishableModel

User = get_user_model()


class BlogCategory(TimeStampedModel):
    """
    Category for grouping blog posts.
    """
    name = models.CharField(max_length=100, verbose_name="Nom")
    slug = models.SlugField(max_length=150, unique=True, verbose_name="Slug")
    description = models.TextField(blank=True, verbose_name="Description")
    is_active = models.BooleanField(default=True, verbose_name="Actif")

    class Meta:
        verbose_name = "Catégorie de blog"
        verbose_name_plural = "Catégories de blog"
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Tag(models.Model):
    """
    Tag for blog posts.
    """
    name = models.CharField(max_length=50, unique=True, verbose_name="Nom")
    slug = models.SlugField(max_length=60, unique=True, verbose_name="Slug")

    class Meta:
        verbose_name = "Tag"
        verbose_name_plural = "Tags"
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class BlogPost(UUIDModel, TimeStampedModel, PublishableModel):
    """
    Blog post model.
    """
    title = models.CharField(max_length=200, verbose_name="Titre")
    slug = models.SlugField(max_length=250, unique=True, verbose_name="Slug")
    excerpt = models.TextField(max_length=300, verbose_name="Extrait")
    content = models.TextField(verbose_name="Contenu")
    
    cover_image = models.ImageField(
        upload_to='blog/',
        blank=True,
        null=True,
        verbose_name="Image de couverture"
    )
    
    video = models.FileField(
        upload_to='blog/videos/',
        blank=True,
        null=True,
        verbose_name="Vidéo descriptive"
    )
    
    author = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='blog_posts',
        verbose_name="Auteur"
    )
    
    category = models.ForeignKey(
        BlogCategory,
        on_delete=models.SET_NULL,
        null=True,
        related_name='posts',
        verbose_name="Catégorie"
    )
    
    tags = models.ManyToManyField(
        Tag,
        blank=True,
        related_name='posts',
        verbose_name="Tags"
    )
    
    views_count = models.IntegerField(
        default=0,
        verbose_name="Nombre de vues"
    )
    
    reading_time = models.IntegerField(
        default=0,
        help_text="Temps de lecture estimé en minutes",
        verbose_name="Temps de lecture"
    )

    class Meta:
        verbose_name = "Article de blog"
        verbose_name_plural = "Articles de blog"
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        
        # Calculate reading time (assuming 200 words per minute)
        if self.content:
            word_count = len(self.content.split())
            self.reading_time = max(1, round(word_count / 200))
        
        super().save(*args, **kwargs)
