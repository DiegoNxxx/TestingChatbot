import { useState } from "react";
import { updateTask, deleteTask as deleteTaskAPI } from "../taskService";

function TaskList({ tasks, setTasks }) {
  // Estados locales para la interfaz
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ 
    title: "", description: "", dueDate: "", estimatedHours: 0, actualHours: 0 
  });

  // Fecha actual para límites en selectores
  const today = new Date().toISOString().split("T")[0];

  // Agrupación de tareas por sprint
  const groupedTasks = tasks.reduce((acc, task) => {
    // Categoría por defecto: Sin Sprint
    const sprint = task.sprint || "Sin Sprint";
    if (!acc[sprint]) acc[sprint] = [];
    acc[sprint].push(task);
    return acc;
  }, {});

  // Datos del formulario para detalles
  const handleOpenDetails = (task) => {
    setSelectedTaskId(task.id);
    setIsEditing(false);
    setEditData({
      title: task.title, description: task.description, dueDate: task.dueDate,
      estimatedHours: task.estimatedHours || 0, actualHours: task.actualHours || 0
    });
  };

  // Guardado de cambios desde edición
  const handleSaveEdit = async (task) => {
    const updatedData = { 
      ...task, 
      title: editData.title, description: editData.description, dueDate: editData.dueDate,
      estimatedHours: Number(editData.estimatedHours) || 0, actualHours: Number(editData.actualHours) || 0 
    };

    try {
      // Actualización local inmediata
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updatedData : t)));
      setIsEditing(false);
      setSelectedTaskId(null);
      // Sincronización con base de datos
      await updateTask(updatedData);
    } catch (err) {
      console.error("Error al sincronizar con servidor:", err);
    }
  };

  // Alternancia de estado: Pendiente/Progreso
  const toggleStarted = async (task) => {
    const newStatus = task.status === "in_progress" ? "pending" : "in_progress";
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)));
    try { await updateTask({ ...task, status: newStatus }); } catch (err) { console.error(err); }
  };

  // Cambio a completado con horas reales
  const toggleComplete = async (task) => {
    // Verificación de estado de completado
    const isCompleting = task.status !== "completed";
    if (isCompleting) {
      // Entrada de horas reales
      const input = prompt("¿Cuántas horas reales tomó esta tarea?", task.actualHours || 0);
      if (input === null) return; 
      const actualHours = Number(input) || 0;
      const updatedTask = { ...task, status: "completed", actualHours };
      // Actualización de estados
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updatedTask : t)));
      try { await updateTask(updatedTask); } catch (err) { console.error(err); }
    } else {
      // Reversión a estado pendiente
      const updatedTask = { ...task, status: "pending" };
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updatedTask : t)));
      try { await updateTask(updatedTask); } catch (err) { console.error(err); }
    }
  };

  // Eliminación de tarea con confirmación
  const deleteTask = async (id) => {
    if (window.confirm("¿Eliminar esta tarea?")) {
      setTasks((prev) => prev.filter((task) => task.id !== id));
      try { await deleteTaskAPI(id); } catch (err) { console.error(err); }
    }
  };

  // Clasificación visual de prioridad
  const getPriorityClass = (p) => (p >= 4 ? "high" : p >= 2 ? "medium" : "low");

  return (
    <section className="task-list">
      <h2>My Tasks</h2>

      {/* Renderizado por grupos de sprint */}
      {Object.entries(groupedTasks).map(([sprintName, sprintTasks]) => (
        <div key={sprintName} className="sprint-group">
          
          {/* Encabezado de sprint */}
          <h3 className="sprint-title">
            {sprintName === "Sin Sprint" ? sprintName : `Sprint ${sprintName}`}
          </h3>
          
          {/* Cabeceras de tabla */}
          <div className="task-header">
            <span>Title</span> <span>Est. Hours</span> <span>Due date</span> 
            <span>Priority</span> <span>Start</span> <span>Complete</span> <span>Details</span>
          </div>

          {/* Mapeo de tareas por grupo */}
          {sprintTasks.map((task) => (
            <div key={task.id}>
              
              {/* Fila de tarea */}
              <div className="task-row">
                <span>{task.title}</span>
                <span>{task.estimatedHours}h</span>
                <span>{task.dueDate}</span>
                <span className={`priority ${getPriorityClass(task.priority)}`}>
                  {task.priority >= 4 ? "High" : task.priority >= 2 ? "Medium" : "Low"}
                </span>

                <button className={`btn-started ${task.status === "in_progress" ? "active" : ""}`} onClick={() => toggleStarted(task)}>
                  {task.status === "in_progress" ? "In Progress" : "Start"}
                </button>

                <button className="btn-complete" onClick={() => toggleComplete(task)}>
                  {task.status === "completed" ? "✔" : "Complete"}
                </button>

                <button className="btn-details" onClick={() => handleOpenDetails(task)}>Details</button>
              </div>

              {/* Panel de detalles activo */}
              {selectedTaskId === task.id && (
                <div className="task-details">
                  {isEditing ? (
                    // Formulario en modo edición
                    <div className="edit-mode">
                      <label>Title</label>
                      <input value={editData.title} onChange={(e) => setEditData({...editData, title: e.target.value})} />
                      
                      <label>Due Date</label>
                      <input type="date" min={today} value={editData.dueDate} onChange={(e) => setEditData({...editData, dueDate: e.target.value})} />

                      <div className="hours-edit-group">
                        <div>
                          <label>Est. Hours</label>
                          <input type="number" value={editData.estimatedHours} onChange={(e) => setEditData({...editData, estimatedHours: Number(e.target.value)})} />
                        </div>
                        <div>
                          <label>Actual Hours</label>
                          <input type="number" value={editData.actualHours} onChange={(e) => setEditData({...editData, actualHours: Number(e.target.value)})} />
                        </div>
                      </div>

                      <label>Description</label>
                      <textarea value={editData.description} onChange={(e) => setEditData({...editData, description: e.target.value})} />
                      
                      <div className="details-actions">
                        <button className="btn-save" onClick={() => handleSaveEdit(task)}>Save</button>
                        <button className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    // Información en modo lectura
                    <div className="view-mode">
                      <p><strong>Due Date:</strong> {task.dueDate}</p>
                      <div className="hours-view">
                        <p><strong>Estimated Hours:</strong> {task.estimatedHours || 0}</p>
                        {/* Condicional para horas reales */}
                        {task.status === "completed" && (
                          <p><strong>Actual Hours:</strong> {task.actualHours || 0}</p>
                        )}
                      </div>
                      <p><strong>Description:</strong> {task.description || "No description provided."}</p>
                      <p><strong>Status:</strong> {task.status}</p>
                      
                      <div className="details-actions">
                        <button className="btn-edit" onClick={() => setIsEditing(true)}>Edit</button>
                        <button className="btn-delete" onClick={() => deleteTask(task.id)}>Delete</button>
                        <button className="btn-close" onClick={() => setSelectedTaskId(null)}>Close</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}

export default TaskList;