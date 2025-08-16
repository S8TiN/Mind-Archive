import os
from pathlib import Path

from dotenv import load_dotenv
import dj_database_url

from corsheaders.defaults import default_headers

CORS_ALLOW_HEADERS = list(default_headers) + ["X-CSRFToken"]

load_dotenv()

# ------------------------------------
# Base
# ------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-me")
DEBUG = os.getenv("DEBUG", "True").lower() == "true"

# Comma-separated list, e.g. "localhost,127.0.0.1,.onrender.com"
ALLOWED_HOSTS = [
    h.strip()
    for h in os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1,.onrender.com").split(",")
    if h.strip()
]

# ------------------------------------
# Installed apps
# ------------------------------------
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "cloudinary_storage",
    "django.contrib.staticfiles",
    "cloudinary",
    "django.contrib.sites",

    "rest_framework",
    "rest_framework.authtoken",
    "dj_rest_auth",
    "dj_rest_auth.registration",
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.google",

    "corsheaders",

    "journal",
]

SITE_ID = 1

# ------------------------------------
# Middleware (WhiteNoise right after Security)
# ------------------------------------
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "allauth.account.middleware.AccountMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# ------------------------------------
# URLs / WSGI
# ------------------------------------
ROOT_URLCONF = "mindarchive.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "mindarchive.wsgi.application"

# ------------------------------------
# Database
# ------------------------------------
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}
# Use Postgres on Render when DATABASE_URL is present
if os.getenv("DATABASE_URL"):
    DATABASES["default"] = dj_database_url.config(conn_max_age=600, ssl_require=True)

# ------------------------------------
# Auth / i18n
# ------------------------------------
AUTH_PASSWORD_VALIDATORS = []
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ------------------------------------
# Static & media (fixes your Render error)
# ------------------------------------
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"  # collectstatic outputs here on Render

_project_static = BASE_DIR / "static"
STATICFILES_DIRS = [_project_static] if _project_static.exists() else []

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# ------------------------------------
# Media: Cloudinary in prod, filesystem in dev
# ------------------------------------
USE_CLOUDINARY = bool(
    os.getenv("CLOUDINARY_URL")               # single URL form
    or os.getenv("CLOUDINARY_CLOUD_NAME")     # separate vars form
)

if USE_CLOUDINARY and not DEBUG:
    # Use Cloudinary for uploaded files (ImageField/FileField)
    DEFAULT_FILE_STORAGE = "cloudinary_storage.storage.MediaCloudinaryStorage"

    # Only needed if you don't provide CLOUDINARY_URL
    CLOUDINARY_STORAGE = {
        "CLOUD_NAME": os.getenv("CLOUDINARY_CLOUD_NAME"),
        "API_KEY": os.getenv("CLOUDINARY_API_KEY"),
        "API_SECRET": os.getenv("CLOUDINARY_API_SECRET"),
    }

    # cloudinary-storage builds full https://res.cloudinary.com/... URLs for you
    MEDIA_URL = "/media/"
else:
    # Local dev: keep using the filesystem
    MEDIA_URL = "/media/"
    MEDIA_ROOT = os.path.join(BASE_DIR, "media")

# ------------------------------------
# DRF
# ------------------------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.TokenAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    "UNAUTHENTICATED_USER": None,
    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
        "rest_framework.parsers.FormParser",
        "rest_framework.parsers.MultiPartParser",
    ],
}

# ------------------------------------
# CORS / CSRF (Vercel + Render + localhost)
# ------------------------------------
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN")  # e.g. https://your-frontend.vercel.app
ADDITIONAL_ORIGIN = os.getenv("ADDITIONAL_ORIGIN")  # optional

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://mindarchive.app",
    "https://www.mindarchive.app",
]

if FRONTEND_ORIGIN:
    CORS_ALLOWED_ORIGINS.append(FRONTEND_ORIGIN)
if ADDITIONAL_ORIGIN:
    CORS_ALLOWED_ORIGINS.append(ADDITIONAL_ORIGIN)

CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://.*\.vercel\.app$",
    r"^https://.*\.onrender\.com$",
]
CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://mindarchive.app",
    "https://www.mindarchive.app",
    "https://*.vercel.app",
    "https://*.onrender.com",
]
if FRONTEND_ORIGIN:
    CSRF_TRUSTED_ORIGINS.append(FRONTEND_ORIGIN.replace("http://", "https://"))
if ADDITIONAL_ORIGIN:
    CSRF_TRUSTED_ORIGINS.append(ADDITIONAL_ORIGIN.replace("http://", "https://"))

LOGIN_REDIRECT_URL = FRONTEND_ORIGIN or "http://localhost:3000"
LOGIN_URL = "/does-not-exist/"

# ------------------------------------
# Allauth (Google)
# ------------------------------------
SOCIALACCOUNT_PROVIDERS = {
    "google": {
        "SCOPE": ["profile", "email"],
        "AUTH_PARAMS": {"access_type": "online"},
        "APP": {
            "client_id": os.getenv("GOOGLE_CLIENT_ID"),
            "secret": os.getenv("GOOGLE_CLIENT_SECRET"),
            "key": "",
        },
    }
}

ACCOUNT_AUTHENTICATION_METHOD = "username"
ACCOUNT_EMAIL_REQUIRED = False
ACCOUNT_USERNAME_REQUIRED = True
ACCOUNT_EMAIL_VERIFICATION = "none"

# ------------------------------------
# Email
# ------------------------------------
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")

# ------------------------------------
# Security for production
# ------------------------------------
if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    # For cross-site cookies (frontend on different domain)
    SESSION_COOKIE_SAMESITE = "None"
    CSRF_COOKIE_SAMESITE = "None"



