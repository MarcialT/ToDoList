let tasks = [];

// Cargar tareas al iniciar la aplicación
document.addEventListener("DOMContentLoaded", async () => {
    await fetchTasks();
});

// Obtener tareas desde la API
async function fetchTasks() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/todos");
        const data = await response.json();
        tasks = data.slice(0, 20); // Tomamos solo 20 tareas para mejor rendimiento
        renderTasks();
    } catch (error) {
        console.error("Error al cargar tareas:", error);
        alert("Hubo un problema al cargar las tareas.");
    }
}

// Renderizar tareas en la interfaz
function renderTasks() {
    const pendingList = document.getElementById("pendingTasks");
    const completedList = document.getElementById("completedTasks");

    pendingList.innerHTML = "";
    completedList.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.textContent = task.title;
        li.classList.toggle("completed", task.completed);

        const toggleBtn = document.createElement("button");
        toggleBtn.textContent = task.completed ? "Desmarcar" : "Completar";
        toggleBtn.onclick = () => toggleTask(task.id);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Eliminar";
        deleteBtn.onclick = () => deleteTask(task.id);

        li.appendChild(toggleBtn);
        li.appendChild(deleteBtn);

        if (task.completed) {
            completedList.appendChild(li);
        } else {
            pendingList.appendChild(li);
        }
    });
}

// Agregar nueva tarea manualmente
async function addTask() {
    const taskInput = document.getElementById("taskInput");
    const newTask = {
        title: taskInput.value,
        completed: false
    };

    if (taskInput.value.trim() !== "") {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/todos", {
                method: "POST",
                body: JSON.stringify(newTask),
                headers: { "Content-Type": "application/json" }
            });

            const savedTask = await response.json();
            savedTask.id = Date.now(); // Simulación de ID único
            tasks.push(savedTask);
            taskInput.value = "";
            renderTasks();
            alert("Tarea agregada!");
        } catch (error) {
            console.error("Error al agregar tarea:", error);
            alert("No se pudo agregar la tarea.");
        }
    } else {
        alert("Escribe una tarea válida.");
    }
}

// Eliminar tarea
async function deleteTask(id) {
    try {
        await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
            method: "DELETE"
        });

        tasks = tasks.filter(task => task.id !== id);
        renderTasks();
        alert("Tarea eliminada.");
    } catch (error) {
        console.error("Error al eliminar tarea:", error);
        alert("No se pudo eliminar la tarea.");
    }
}

// Marcar o desmarcar tarea como completada
async function toggleTask(id) {
    try {
        const task = tasks.find(task => task.id === id);
        task.completed = !task.completed;

        await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ completed: task.completed }),
            headers: { "Content-Type": "application/json" }
        });

        renderTasks();
    } catch (error) {
        console.error("Error al actualizar tarea:", error);
        alert("No se pudo actualizar la tarea.");
    }
}
