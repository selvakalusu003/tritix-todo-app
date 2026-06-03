from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from django.urls import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import (
    ListView,
    CreateView,
    UpdateView,
    DeleteView,
)

from .models import Task
from .forms import TaskForm
from .serializers import TaskSerializer

class TaskListView(LoginRequiredMixin, ListView):
    model = Task
    template_name = "tasks/dashboard.html"
    context_object_name = "tasks"

    def get_queryset(self):
        return Task.objects.filter(
            user=self.request.user
        ).select_related(
            "category",
            "user"
        )


class TaskCreateView(LoginRequiredMixin, CreateView):
    model = Task
    form_class = TaskForm
    template_name = "tasks/task_form.html"
    success_url = reverse_lazy("task-list")

    def form_valid(self, form):
        form.instance.user = self.request.user
        return super().form_valid(form)


class TaskUpdateView(LoginRequiredMixin, UpdateView):
    model = Task
    form_class = TaskForm
    template_name = "tasks/task_form.html"
    success_url = reverse_lazy("task-list")

    def get_queryset(self):
        return Task.objects.filter(
            user=self.request.user
        )


class TaskDeleteView(LoginRequiredMixin, DeleteView):
    model = Task
    template_name = "tasks/task_confirm_delete.html"
    success_url = reverse_lazy("task-list")

    def get_queryset(self):
        return Task.objects.filter(
            user=self.request.user
        )

class TaskViewSet(viewsets.ModelViewSet):

    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(
            user=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user
        )