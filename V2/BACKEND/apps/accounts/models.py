"""
User model for authentication and authorization.
"""
import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone


class UserManager(BaseUserManager):
    """
    Custom user manager for email-based authentication.
    """
    def create_user(self, email, password=None, **extra_fields):
        """
        Create and save a regular user with the given email and password.
        """
        if not email:
            raise ValueError('L\'adresse email est obligatoire')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Create and save a superuser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'SUPER_ADMIN')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom User model with UUID primary key and role-based access.
    """
    ROLE_CHOICES = [
        ('SUPER_ADMIN', 'Super Administrateur'),
        ('ADMIN', 'Administrateur'),
        ('EDITOR', 'Éditeur'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, verbose_name='Email')
    first_name = models.CharField(max_length=150, verbose_name='Prénom')
    last_name = models.CharField(max_length=150, verbose_name='Nom')
    phone = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        unique=True,
        verbose_name='Téléphone',
        help_text='Numéro de téléphone au format international (ex: +228XXXXXXXXXX)'
    )
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='ADMIN',
        verbose_name='Rôle'
    )
    avatar = models.ImageField(
        upload_to='avatars/',
        blank=True,
        null=True,
        verbose_name='Photo de profil'
    )
    
    is_active = models.BooleanField(default=True, verbose_name='Actif')
    is_staff = models.BooleanField(default=False, verbose_name='Staff')
    is_deleted = models.BooleanField(default=False, verbose_name='Supprimé (soft delete)')
    deleted_at = models.DateTimeField(blank=True, null=True, verbose_name='Date de suppression')
    
    # First login verification
    is_email_verified = models.BooleanField(default=False, verbose_name='Email vérifié')
    email_verification_code = models.CharField(max_length=6, blank=True, null=True, verbose_name='Code de vérification')
    email_verification_code_expires = models.DateTimeField(blank=True, null=True, verbose_name='Expiration du code')
    email_verification_resend_count = models.IntegerField(default=0, verbose_name='Nombre de renvois OTP')
    must_change_password = models.BooleanField(default=True, verbose_name='Doit changer le mot de passe')
    
    # Password reset
    password_reset_code = models.CharField(max_length=6, blank=True, null=True, verbose_name='Code de réinitialisation')
    password_reset_code_expires = models.DateTimeField(blank=True, null=True, verbose_name='Expiration code réinitialisation')
    password_reset_resend_count = models.IntegerField(default=0, verbose_name='Nombre de renvois reset')
    
    date_joined = models.DateTimeField(default=timezone.now, verbose_name='Date d\'inscription')
    last_login = models.DateTimeField(blank=True, null=True, verbose_name='Dernière connexion')

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        verbose_name = 'Utilisateur'
        verbose_name_plural = 'Utilisateurs'
        ordering = ['-date_joined']

    def __str__(self):
        return self.email

    def get_full_name(self):
        """
        Return the first_name plus the last_name, with a space in between.
        """
        return f'{self.first_name} {self.last_name}'.strip()

    def get_short_name(self):
        """
        Return the short name for the user.
        """
        return self.first_name

    @property
    def is_admin(self):
        """Check if user is admin or super admin."""
        return self.role in ['ADMIN', 'SUPER_ADMIN']

    @property
    def is_super_admin(self):
        """Check if user is super admin."""
        return self.role == 'SUPER_ADMIN'

    @property
    def is_editor(self):
        """Check if user is editor."""
        return self.role == 'EDITOR'

    @property
    def can_publish(self):
        """Check if user can publish content."""
        return self.role in ['ADMIN', 'SUPER_ADMIN']

    def soft_delete(self):
        """Soft delete the user."""
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.is_active = False
        self.save()

    def restore(self):
        """Restore a soft-deleted user."""
        self.is_deleted = False
        self.deleted_at = None
        self.is_active = True
        self.save()

    def generate_verification_code(self):
        """Generate a 6-digit OTP code and reset resend counter."""
        import random
        code = ''.join([str(random.randint(0, 9)) for _ in range(6)])
        self.email_verification_code = code
        self.email_verification_code_expires = timezone.now() + timezone.timedelta(minutes=15)
        self.email_verification_resend_count = 0  # Reset counter on new code generation
        self.save()
        return code

    def verify_code(self, code):
        """Verify the OTP code and reset resend counter."""
        if not self.email_verification_code:
            return False
        if self.email_verification_code_expires < timezone.now():
            return False
        if self.email_verification_code != code:
            return False
        
        self.is_email_verified = True
        self.email_verification_code = None
        self.email_verification_code_expires = None
        self.email_verification_resend_count = 0  # Reset counter after successful verification
        self.save()
        return True
    
    def generate_password_reset_code(self):
        """Generate a 6-digit password reset code."""
        import random
        code = ''.join([str(random.randint(0, 9)) for _ in range(6)])
        self.password_reset_code = code
        self.password_reset_code_expires = timezone.now() + timezone.timedelta(minutes=15)
        self.password_reset_resend_count = 0  # Reset counter
        self.save()
        return code
    
    def verify_password_reset_code(self, code):
        """Verify the password reset code."""
        if not self.password_reset_code:
            return False
        if self.password_reset_code_expires < timezone.now():
            return False
        if self.password_reset_code != code:
            return False
        return True
    
    def reset_password_with_code(self, code, new_password):
        """Reset password using the verification code."""
        if not self.verify_password_reset_code(code):
            return False
        
        self.set_password(new_password)
        self.password_reset_code = None
        self.password_reset_code_expires = None
        self.password_reset_resend_count = 0
        self.save()
        return True
