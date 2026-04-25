import { useState } from "react";

// Sidebar para cambiar entre vistas de la aplicación
function Sidebar({ setVista }) {

  // Controla si estás en modo individual o team
  const [modo, setModo] = useState("individual");

  return (
    <div>
      <nav className="menu-lateral">

        {/* Botón para modo individual */}
        <button 
          className="btn-menu"
          onClick={() => setModo("individual")}
        >
          Individual
        </button>

        {/* Botón para modo equipo */}
        <button 
          className="btn-menu perfil"
          onClick={() => setModo("team")}
        >
          Team
        </button>

        <div className="tasks-buttons">

          {/* Opciones del modo individual */}
          {modo === "individual" && (
            <>
              <h2></h2>

              {/* Tareas pendientes del usuario */}
              <button 
                className="btn-Tasks pending" 
                onClick={() => setVista("Mypending")}
              >
                My Tasks
              </button>

              <h2></h2>

              {/* Estadísticas del usuario */}
              <button 
                className="btn-Tasks completed" 
                onClick={() => setVista("Mycompleted")}
              >
                My Analytics
              </button>
            </>
          )}

          {/* Opciones del modo equipo */}
          {modo === "team" && (
            <>
              {/* Crear nueva tarea */}
              <button 
                className="btn-Tasks add" 
                onClick={() => setVista("add")}
              >
                Add Task +
              </button>

              <h2></h2>

              {/* Vista de todas las tareas pendientes */}
              <button 
                className="btn-Tasks pending" 
                onClick={() => setVista("TotalPending")}
              >
                Pending Tasks
              </button>

              <h2></h2>

              {/* Análisis de tareas del equipo */}
              <button 
                className="btn-Tasks completed" 
                onClick={() => setVista("TeamAnalytics")}
              >
                Tasks Analysis
              </button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;