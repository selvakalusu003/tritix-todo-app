// ======================
// STATE
// ======================

let tasks = [];
let deletedTask = null;
let editingTaskId = null;

// ======================
// ELEMENTS
// ======================

const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const categoryFilter = document.getElementById("categoryFilter");
const priorityFilter = document.getElementById("priorityFilter");
const sortSelect = document.getElementById("sortSelect");
const themeToggle = document.getElementById("themeToggle");
const clearCompleted = document.getElementById("clearCompleted");

// Modal

const taskModal = document.getElementById("taskModal");
const editTitle = document.getElementById("editTitle");
const editCategory = document.getElementById("editCategory");
const editPriority = document.getElementById("editPriority");
const editDate = document.getElementById("editDate");
const saveEditBtn = document.getElementById("saveEditBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const addTaskModal = document.getElementById("addTaskModal");
const openAddModalBtn = document.getElementById("openAddModalBtn");
const closeAddModalBtn = document.getElementById("closeAddModalBtn");
const createTaskBtn = document.getElementById("createTaskBtn");
const editModal = document.getElementById("editModal");

function getCSRFToken() {
    const cookieValue = document.cookie
        .split("; ")
        .find(row => row.startsWith("csrftoken="));

    return cookieValue
        ? cookieValue.split("=")[1]
        : "";
}


// ======================
// ADD TASK
// ======================
async function addTask() {

    const title = document.getElementById("newTaskTitle") .value .trim();
    const categoryName = document.getElementById("newTaskCategory") .value;
    const priority = document.getElementById("newTaskPriority") .value .toLowerCase();
    const dueDate = document.getElementById("newTaskDate") .value;

    if (!title) {
        alert("Enter task title");
        return;
    }

    const categoryMap = { Work: 1, Personal: 2, Health: 3};

    try {

        const response = await fetch(
            "/api/tasks/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCSRFToken()
                },
                body: JSON.stringify({
                    title: title,
                    description: "",
                    priority: priority.toLowerCase(),
                    due_date: dueDate,
                    completed: false,
                    category: categoryMap[categoryName]
                })
            }
        );

        const data = await response.json();

        console.log("Status:", response.status);
        console.log("Response:", data);

        if (!response.ok) {
            throw new Error(
                JSON.stringify(data)
            );
        }

        addTaskModal.classList.remove("show");
        document.getElementById("newTaskTitle").value = "";
        document.getElementById("newTaskCategory").selectedIndex = 0;
        document.getElementById("newTaskPriority").selectedIndex = 0;
        document.getElementById("newTaskDate").value = "";

        await loadTasksFromAPI();

    } catch (error) {

        console.error("Create Task Error:",error);

        alert("Unable to create task.\nCheck console for details.");
    }
}

if (createTaskBtn) {

    createTaskBtn.addEventListener("click", addTask);

}
// ======================
// TOGGLE COMPLETE
// ======================

async function toggleTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return;
    }

    try {

        const response = await fetch(
            `/api/tasks/${id}/`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCSRFToken()
                },
                body: JSON.stringify({
                    completed: !task.completed
                })
            }
        );

        if (!response.ok) {
            throw new Error("Failed to update task");
        }

        await loadTasksFromAPI();

    } catch (error) {

        console.error("Toggle Task Error:",error);
        alert("Unable to update task");
    }
}
// ======================
// DELETE
// ======================

async function deleteTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return;
    }

    if (!confirm("Delete this task?")) {
        return;
    }

    try {

        const response = await fetch(
            `/api/tasks/${id}/`,
            {
                method: "DELETE",
                headers: {
                    "X-CSRFToken":
                        getCSRFToken()
                }
            }
        );

        if (!response.ok) {
            throw new Error("Failed to delete task");
        }

        await loadTasksFromAPI();

    } catch (error) {

        console.error("Delete Task Error:",error);
        alert("Unable to delete task");
    }
}
// ======================
// EDIT MODAL
// ======================

function openEditModal(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    editingTaskId = id;

    editTitle.value = task.title;
    editCategory.value = task.category_name;         
    editPriority.value = task.priority;
    editDate.value = task.due_date;

    taskModal.classList.add("show");
}

function closeModal() {
    taskModal.classList.remove("show");
    editingTaskId = null;
}

saveEditBtn.addEventListener(
    "click",
    async () => {

        const task = tasks.find (task => task.id === editingTaskId);

        if (!task) {
            return;
        }

        try {

            const categoryMap = { Work: 1, Personal: 2, Health: 3};

            const response =
                await fetch(
                    `/api/tasks/${editingTaskId}/`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type":
                                "application/json",
                            "X-CSRFToken":
                                getCSRFToken()
                        },
                        body: JSON.stringify({
                            title:
                                editTitle.value.trim(),
                            priority:
                                editPriority.value
                                    .toLowerCase(),
                            due_date:
                                editDate.value,
                            category:
                                categoryMap[
                                    editCategory.value
                                ]
                        })
                    }
                );

                const data = await response.json();

                console.log("Status:", response.status);
                console.log("Response:", data);

                if (!response.ok) {
                    throw new Error(
                        JSON.stringify(data)
                    );
                }

            closeModal();

            await loadTasksFromAPI();

        } catch (error) {

            console.error("Edit Task Error:",error);
            alert("Unable to update task");
        }
    }
);

closeModalBtn .addEventListener("click", closeModal);

// ======================
// FILTER + SEARCH
// ======================

function getFilteredTasks() {

    let filtered = [...tasks];

    const keyword = searchInput.value
            .toLowerCase()
            .trim();

    if (keyword) {

        filtered = filtered.filter(task => task.title .toLowerCase() .includes(keyword));
    }

 /* =========================
       STATUS FILTER
    ========================= */

    const status = statusFilter.value;

    if (status === "active") {

        filtered = filtered.filter(task => !task.completed);
    }

    if (status === "completed") {

        filtered = filtered.filter(task => task.completed);
    }

    /* =========================
       CATEGORY FILTER
    ========================= */

    const category = categoryFilter.value;

    if (category !== "all") {

        filtered = filtered.filter(task => task.category_name === category);
    }

    /* =========================
    PRIORITY FILTER
    ========================= */

    const priority = priorityFilter.value.toLowerCase();

    if (priority !== "all") {

        filtered = filtered.filter(task => task.priority.toLowerCase() === priority);
    }

    /* =========================
       SORTING
    ========================= */

    switch (sortSelect.value) {

        case "alphabetical": filtered.sort((a, b) => a.title.localeCompare(b.title));
            break;

        case "priority": const order = { high: 1, medium: 2, low: 3};

            filtered.sort((a, b) => order[a.priority] - order[b.priority]);
            break;

        case "date":
            filtered.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
            break;

        default: filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return filtered;
}

// ======================
// TOAST
// ======================

function showUndoToast() {

    const toast = document.getElementById("toast");

    toast.innerHTML = `
        Task deleted <button id="undoBtn"> Undo </button>
    `;

    toast.classList.add("show");

    document .getElementById("undoBtn") .addEventListener("click",
        () => {
                if (deletedTask) 
                    {
                    tasks.unshift(deletedTask);
                    refreshUI();
                }

                toast.classList.remove("show");
            }
        );

    setTimeout(
        () => toast.classList.remove("show"),5000
    );
}

// ======================
// CLEAR COMPLETED
// ======================

if (clearCompleted) {

    clearCompleted.addEventListener(
        "click",
        e => {

            e.preventDefault();
            tasks = tasks.filter( task => !task.completed);
            refreshUI();

        }
    );
}

// ======================
// THEME
// ======================

function applyTheme(theme) {

    document.documentElement.setAttribute("data-theme", theme);
    saveTheme(theme);

    themeToggle.textContent =
        theme === "dark"
            ? "☀️ Light"
            : "🌙 Dark";
}

themeToggle.addEventListener("click",
    () => {

        const current = document.documentElement.getAttribute("data-theme");

        applyTheme(
            current === "dark"
                ? "light"
                : "dark"
        );
    }
);

// ======================
// EVENTS
// ======================

searchInput.addEventListener("input",refreshUI);
statusFilter.addEventListener("change",refreshUI);
categoryFilter.addEventListener("change",refreshUI);
priorityFilter.addEventListener("change",refreshUI);
sortSelect.addEventListener("change",refreshUI);

/* =========================
   KEYBOARD SHORTCUTS
========================= */

document.addEventListener("keydown", function (event) {

    const activeElement = document.activeElement;

    const isTyping =
        activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA" ||
        activeElement.tagName === "SELECT";

    /* ESC = CLOSE MODALS */

    if (event.key === "Escape") {

        event.preventDefault();

        if ( addTaskModal && addTaskModal.classList.contains("show")) {

            if ( typeof resetAddTaskForm === "function") {
                
                resetAddTaskForm();
            }

            addTaskModal.classList.remove("show");
        }

        if (editModal && editModal.classList.contains("show")) {
            
            editModal.classList.remove("show");
        }

        return;
    }

    /* Ignore shortcuts while typing */

    if (isTyping) {
        return;
    }

    /* N = OPEN ADD TASK MODAL */

    if (
        event.key.toLowerCase() === "n"
    ) {

        event.preventDefault();

        const addModalOpen = addTaskModal && addTaskModal.classList.contains("show");

        const editModalOpen = editModal && editModal.classList.contains("show");

        if (!addModalOpen && !editModalOpen) {
            
            addTaskModal.classList.add("show");
        }
    }
});
// ======================
// REFRESH UI
// ======================

function refreshUI() {

    const filteredTasks = getFilteredTasks();
    renderTasks(filteredTasks, taskList);

    attachTaskEvents();
    initializeDragAndDrop(taskList, tasks, () => {}, refreshUI);
}

// ======================
// TASK EVENTS
// ======================

function attachTaskEvents() {

    const taskElements = taskList .querySelectorAll(".task");

    taskElements.forEach(
        element => {

            const id = Number(element.dataset.id);

            element .querySelector(".task-checkbox") .addEventListener("change",() => toggleTask(id));
            element .querySelector(".delete") .addEventListener("click",() => deleteTask(id));
            element .querySelector(".edit-btn") .addEventListener("click",() => openEditModal(id));
        }
    );
}

// ======================
// INIT
// ======================

applyTheme(loadTheme());

loadTasksFromAPI();

openAddModalBtn.addEventListener("click",
    () => { addTaskModal.classList.add("show");}
);

closeAddModalBtn.addEventListener("click",
    () => { addTaskModal.classList.remove("show");}
);

// ======================
// LOAD TASK FROM API
// ======================
async function loadTasksFromAPI() {
    try {
        const response = await fetch("/api/tasks/");

        const data = await response.json();

        tasks = data.results;
        updateApiPanel();

        refreshUI();

    } catch (error) {
        console.error("Error loading tasks:",error);
    }
}

async function updateApiPanel() {

    const panel = document.getElementById("apiResponsePanel");

    if (!panel) {
        return;
    }

    panel.textContent = JSON.stringify(
            {
                count: tasks.length,
                results: tasks.slice(0, 5)
            },
            null,
            2
        );
}

    const categoryModal = document.getElementById("categoryModal");
    const saveCategoryBtn = document.getElementById("saveCategoryBtn");
    const closeCategoryModal = document.getElementById("closeCategoryModal");
    const addCategoryBtn = document.querySelector(".add-category-btn");

    addCategoryBtn.addEventListener("click",
        () => { categoryModal.classList.add("show");}
    );

    closeCategoryModal.addEventListener("click",
        () => { categoryModal.classList.remove("show");}
    );

    saveCategoryBtn.addEventListener("click",
        async () => {

            const name = document.getElementById("categoryName") .value .trim();

            if (!name) {
                alert("Enter category name");
                return;
            }

            try {

                const response = await fetch(
                        "/api/categories/",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "X-CSRFToken": getCSRFToken()
                            },

                            body: JSON.stringify({
                                name: name
                            })
                        }
                    );

                if (!response.ok) {
                    throw new Error("Failed to create category");
                }

                document.getElementById("categoryName").value = "";

                categoryModal.classList.remove("show");

                await loadCategories();

            }
            catch (error) {
                console.error(error);
                alert("Unable to create category");
            }
        }
    );