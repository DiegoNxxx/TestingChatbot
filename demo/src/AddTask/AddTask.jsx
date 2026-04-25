import { useState, useEffect } from "react";
import { createTask, getUsers } from "../taskService";
import "./AddTask.css";

function AddTask({ onCancel, reloadTasks }) {

  // Datos básicos de la tarea
  // Inicialización de estados locales para capturar la entrada del usuario
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState("Low");
  const [desc, setDesc] = useState("");

  // horas
  // Estados para gestionar métricas de tiempo estimadas y reales
  const [estimatedHours, setEstimatedHours] = useState("");
  const [actualHours, setActualHours] = useState(""); // Agregado para consistencia

  // sprint
  // Estado para asociar la tarea al sprint correspondiente
  const [sprint, setSprint] = useState("Sprint 1");

  // Usuarios
  // Estados para almacenar la lista de usuarios y el usuario seleccionado en el formulario
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  // Mapeo manual de nombres
  const nombres = {
    1: "Diego",
    2: "Javier",
    3: "Paco",
    4: "Álvaro"
  };

  // Cargar usuarios
  // Hook que se ejecuta al montar el componente para obtener los usuarios del backend
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);

        // Selección automática del primer usuario para evitar errores de validación
        if (data.length > 0) {
          setSelectedUser(data[0].id);
        }
      } catch (error) {
        console.error("Error cargando usuarios:", error);
      }
    };

    loadUsers();
  }, []);

  // Enviar formulario
  // Lógica principal de procesamiento, conversión de tipos y llamada al servicio de persistencia
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser) {
      alert("Selecciona un usuario");
      return;
    }

    // Normalización de la prioridad a formato numérico para el backend
    const priorityNumber =
      priority === "High" ? 5 :
      priority === "Medium" ? 3 : 1;

    // Estructuración del objeto para cumplir con el esquema de la base de datos
    const newTask = {
      id: Date.now(), // ID único para evitar duplicados en el listado
      userId: Number(selectedUser),
      title,
      description: desc,
      status: "pending",
      priority: priorityNumber,
      dueDate: date,

      // Conversión explícita a números para asegurar la integridad de datos
      estimatedHours: Number(estimatedHours) || 0,
      actualHours: Number(actualHours) || 0,
      sprint: sprint
    };

    try {
      // Petición al servicio para guardar la tarea y refresco de interfaz
      await createTask(newTask);
      await reloadTasks();
      onCancel(); // Cierre del formulario tras el éxito
    } catch (err) {
      console.error("Error creando tarea:", err);
    }
  };

  return (
    <section className="add-task-container">
      <h2>Add New Task</h2>

      <form onSubmit={handleSubmit} className="task-form">

        <div className="form-group">
          <h3>Task Info</h3>

          <input 
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea 
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          {/* NUEVO: horas */}
          <div className="row">
            <input
              type="number"
              placeholder="Estimated Hours"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
            />
           
          </div>
        </div>

        <div className="form-group">
          <h3>Settings</h3>

          <div className="row">

            {/* Usuario */}
            <div className="field-container">
              <label>Assign To</label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                required
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {(nombres[u.id] || "Desconocido")} (ID: {u.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Sprint */}
            <div className="field-container">
              <label>Sprint</label>
              <select value={sprint} onChange={(e) => setSprint(e.target.value)}>
                <option value="Sprint 1">Sprint 1</option>
                <option value="Sprint 2">Sprint 2</option>
              </select>
            </div>

            {/* Fecha */}
            <div className="field-container">
              <label>Due Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {/* Prioridad */}
            <div className="field-container">
              <label>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

          </div>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-save">
            Save Task
          </button>

          <button
            type="button"
            className="btn-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>

      </form>
    </section>
  );
}

export default AddTask;