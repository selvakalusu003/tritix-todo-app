from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .views import (
    TaskListView,
    TaskCreateView,
    TaskUpdateView,
    TaskDeleteView,
)

from .api_views import (
    TaskViewSet,
    CategoryViewSet,
)

router = DefaultRouter()

router.register(
    r"tasks",
    TaskViewSet,
    basename="task"
)

router.register(
    r"categories",
    CategoryViewSet,
    basename="category"
)

urlpatterns = [

    # Dashboard

    path(
        "",
        TaskListView.as_view(),
        name="task-list",
    ),

    path(
        "task/create/",
        TaskCreateView.as_view(),
        name="task-create",
    ),

    path(
        "task/<int:pk>/update/",
        TaskUpdateView.as_view(),
        name="task-update",
    ),

    path(
        "task/<int:pk>/delete/",
        TaskDeleteView.as_view(),
        name="task-delete",
    ),

    # API

    path(
        "api/",
        include(router.urls),
    ),
]