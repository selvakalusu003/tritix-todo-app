from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),

    path(
        "accounts/",
        include("django.contrib.auth.urls"),
    ),

    path(
        "register/",
        include("users.urls"),
    ),

    path(
        "",
        include("tasks.urls"),
    ),
    path(
        "api/",
        include("tasks.api_urls"),
    ),
]