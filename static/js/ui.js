function formatDate(dateString) {
    if (!dateString) return "-";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    });
}

// ======================
// OVERDUE CHECK
// ======================

function isOverdue(task) {
    if (!task.due_date) return false;

    const today = new Date()
        .toISOString()
        .split("T")[0];

    return (task.due_date < today && !task.completed);
}

// ======================
// PROGRESS BAR
// ======================

function updateProgressBar(tasks) {
    const progressFill = document.getElementById("progressFill");
    const progressInfo = document.getElementById("progressInfo");
    const completed = tasks.filter(task => task.completed).length;
    const total = tasks.length;

    const percentage =
            total === 0
            ? 0
            : Math.round(
                  (completed / total) * 100
              );

    progressFill.style.width = `${percentage}%`;

    progressInfo.textContent =
        `${completed}/${total} tasks — ${percentage}%`;
}

// ======================
// STATS
// ======================

function updateStats(tasks) {
   
    const completed = tasks.filter(task => task.completed).length;
    const total = tasks.length;
    const remaining = total - completed;
    const overdue = tasks.filter(task => isOverdue(task)).length;
    const taskSummary = document.getElementById("taskSummary");
    const remainingTasks = document.getElementById("remainingTasks");
    const overdueCount = document.getElementById("overdueCount");

    if (taskSummary) {
        taskSummary.textContent =
            `${completed} of ${total} tasks completed`;
    }

    if (remainingTasks) {
        remainingTasks.textContent =
            `${remaining} tasks remaining`;
    }

    if (overdueCount) {
        overdueCount.textContent =
            `${overdue} overdue`;
    }

    updateProgressBar(tasks);

    const headerOverdue = document.getElementById("headerOverdue");

    if (headerOverdue) {
        headerOverdue.textContent =
            `● ${overdue} overdue`;
    }

    const totalTasks = document.getElementById("totalTasks");

    if (totalTasks) {
        totalTasks.textContent = tasks.length;
    }

    const completedTasks = document.getElementById("completedTasks");

    if (completedTasks) {
        completedTasks.textContent = completed;
    }

    const overdueTasks = document.getElementById("overdueTasks");

    if (overdueTasks) {
        overdueTasks.textContent = overdue;
    }

    const allTasksCount = document.getElementById("allTasksCount");
    const todayTasksCount = document.getElementById("todayTasksCount");

    if (allTasksCount) {
        allTasksCount.textContent = tasks.length;
    }

    const today = new Date()
        .toISOString()
        .split("T")[0];

    const todayCount = tasks.filter(task => task.due_date === today).length;

    if (todayTasksCount) {
        todayTasksCount.textContent = todayCount;
    }
    const taskRangeInfo = document.getElementById("taskRangeInfo");

    if (taskRangeInfo) {

        taskRangeInfo.textContent = 
                tasks.length === 0
                ? "No tasks"
                : `Showing 1-${tasks.length} of ${tasks.length} tasks`;
    }

    const workCount = document.getElementById("workCount");
    const healthCount = document.getElementById("healthCount");
    const personalCount = document.getElementById("personalCount");
    const workTasks = tasks.filter( task => task.category_name === "Work").length;
    const healthTasks = tasks.filter( task => task.category_name === "Health").length;
    const personalTasks = tasks.filter(task => task.category_name === "Personal").length;

    if (workCount) {
        workCount.textContent = workTasks;
    }

    if (healthCount) {
        healthCount.textContent = healthTasks;
    }

    if (personalCount) {
        personalCount.textContent = personalTasks;
    }
}

// ======================
// CREATE TASK ELEMENT
// ======================

function createTaskElement(task) {

    const article = document.createElement("article");

    article.classList.add("task");

    if (task.completed) {
        article.classList.add("completed");
    }

    if (isOverdue(task)) {
        article.classList.add("overdue-task");
    }

    article.setAttribute( "draggable", "true");

    article.dataset.id = task.id;

    article.innerHTML = `

        <div class="task-col task-title-col">
            <input type="checkbox" class="task-checkbox"
                ${task.completed ? "checked" : ""}
            >

            <span class="task-name">
                ${task.title}
            </span>
        </div>

        <div class="task-col">
            <span class="badge category-${(task.category_name || "general").toLowerCase()}">
                ${task.category_name}
            </span>
        </div>

        <div class="task-col">
            <span class="badge ${task.priority.toLowerCase()}">
                ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
        </div>

        <div class="task-col due-date">
            ${
                isOverdue(task)
                    ? '<span class="overdue-label">Overdue</span>'
                    : formatDate(task.due_date)
            }
        </div>

        <div class="task-col actions">
            <button class="edit-btn" title="Edit Task">
                ✏️
            </button>

            <button class="delete" title="Delete Task">
                ✕
            </button>
        </div>

    `;

    return article;
}
// ======================
// RENDER TASKS
// ======================

function renderTasks(tasks, taskList) {
    taskList.innerHTML = "";

    if (tasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">No tasks found</div>
        `;

        updateStats(tasks);
        return;
    }

    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    });

    updateStats(tasks);
}