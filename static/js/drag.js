let draggedTaskId = null;

function initializeDragAndDrop(
    taskList,
    tasks,
    saveCallback,
    renderCallback
) {
    const taskItems = taskList.querySelectorAll(".task");

    taskItems.forEach(item => {
        item.addEventListener("dragstart", handleDragStart);
        item.addEventListener("dragover", handleDragOver);
        item.addEventListener("drop", handleDrop);
        item.addEventListener("dragend", handleDragEnd);
    });

    function handleDragStart(e) {
        draggedTaskId = Number(this.dataset.id);

        this.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    }

    function handleDrop(e) {
        e.preventDefault();

        const targetTaskId = Number(this.dataset.id);

        if (draggedTaskId === null || draggedTaskId === targetTaskId) { 
                return;
        }

        const fromIndex = tasks.findIndex(task => task.id === draggedTaskId);
        const toIndex = tasks.findIndex(task => task.id === targetTaskId);

        if (fromIndex === -1 || toIndex === -1) {
            return;
        }

        const movedTask = tasks.splice(fromIndex, 1)[0];

        tasks.splice(toIndex, 0, movedTask);

        // Re-render only
        renderCallback();
    }

    function handleDragEnd() {
        this.classList.remove("dragging");
        draggedTaskId = null;
    }
}