from rest_framework import serializers

from .models import Task, Category


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category

        fields = [
            "id",
            "name",
        ]


class TaskSerializer(serializers.ModelSerializer):

    category_name = serializers.CharField(
        source="category.name",
        read_only=True,
    )

    class Meta:
        model = Task

        fields = [
            "id",
            "title",
            "description",
            "priority",
            "due_date",
            "completed",
            "category",
            "category_name",
            "created_at",
            "updated_at",
        ]