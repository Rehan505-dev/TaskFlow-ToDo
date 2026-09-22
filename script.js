const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const taskCount = document.getElementById("taskCount");
const clearCompleted = document.getElementById("clearCompleted");
const filterButtons = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("taskflowTasks") || "[]");
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("taskflowTasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = "";

    const visibleTasks = tasks.filter(task => {
        if (currentFilter === "active") return !task.completed;
        if (currentFilter === "completed") return task.completed;
        return true;
    });

    visibleTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "task" + (task.completed ? " completed" : "");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => toggleTask(task.id));

        const span = document.createElement("span");
        span.textContent = task.text;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteTask(task.id));

        li.append(checkbox, span, deleteButton);
        taskList.appendChild(li);
    });

    emptyMessage.style.display = visibleTasks.length === 0 ? "block" : "none";

    const remaining = tasks.filter(task => !task.completed).length;
    taskCount.textContent = `${remaining} task${remaining === 1 ? "" : "s"} remaining`;
}

function addTask(text) {
    tasks.push({
        id: Date.now(),
        text: text.trim(),
        completed: false
    });
    saveTasks();
    renderTasks();
}

function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

taskForm.addEventListener("submit", event => {
    event.preventDefault();
    const text = taskInput.value.trim();

    if (text === "") {
        taskInput.focus();
        return;
    }

    addTask(text);
    taskInput.value = "";
    taskInput.focus();
});

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(item => item.classList.remove("active"));
        button.classList.add("active");

        renderTasks();
    });
});

clearCompleted.addEventListener("click", () => {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
});

renderTasks();
