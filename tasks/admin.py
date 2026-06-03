from django.contrib import admin
from .models import Category, Task


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "created_at",
    )

    search_fields = (
        "name",
    )

    ordering = (
        "name",
    )


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "priority",
        "completed",
        "category",
        "user",
        "due_date",
        "created_at",
    )

    list_filter = (
        "priority",
        "completed",
        "category",
        "created_at",
    )

    search_fields = (
        "title",
        "description",
        "user__username",
        "category__name",
    )

    ordering = (
        "-created_at",
    )