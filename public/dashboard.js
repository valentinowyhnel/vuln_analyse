// dashboard.js

document.addEventListener("DOMContentLoaded", () => {
  const taskContainer = document.getElementById("task-container");
  const addTaskForm = document.getElementById("add-task-form");
  const taskInput = document.getElementById("task-input");

  // Fetch existing tasks
  const fetchTasks = async () => {
    const res = await fetch("/tasks");
    const tasks = await res.json();
    taskContainer.innerHTML = ""; // Clear container
    tasks.forEach((task) => {
      const taskDiv = document.createElement("div");
      taskDiv.className = "task";
      taskDiv.innerHTML = `
        <span>${task.task}</span>
        <button data-id="${task.id}">Delete</button>
      `;
      taskContainer.appendChild(taskDiv);
    });
  };

  // Add new task
  addTaskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await fetch("/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task: taskInput.value }),
    });
    taskInput.value = ""; // Clear input
    fetchTasks();
  });

  // Delete task
  taskContainer.addEventListener("click", async (e) => {
    if (e.target.tagName === "BUTTON") {
      const taskId = e.target.dataset.id;
      await fetch(`/tasks/${taskId}`, { method: "DELETE" });
      fetchTasks();
    }
  });

  fetchTasks(); // Initial fetch
});
