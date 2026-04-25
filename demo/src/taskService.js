import data from "./data/db.json";

// Obtener tareas
export const getTasks = async () => {
  return data.tasks;
};

// Obtener usuarios
export const getUsers = async () => {
  return data.users;
};

// Crear tarea (solo en memoria)
export const createTask = async (task) => {
  const newTask = {
    ...task,
    id: Date.now()
  };

  data.tasks.push(newTask);
  return newTask;
};

// Actualizar tarea (en memoria)
export const updateTask = async (updatedTask) => {
  const index = data.tasks.findIndex(t => t.id === updatedTask.id);
  if (index !== -1) {
    data.tasks[index] = updatedTask;
  }
  return updatedTask;
};

// Eliminar tarea (en memoria)
export const deleteTask = async (id) => {
  const index = data.tasks.findIndex(t => t.id === id);
  if (index !== -1) {
    data.tasks.splice(index, 1);
  }
};