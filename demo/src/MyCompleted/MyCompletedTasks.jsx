import { useMemo } from "react";
import "./MyCompletedTasks.css";

function TotalCompletedTasks({ tasks = [], users = [] }) {
  
  // Agrupar todas las tareas por sprint antes de cualquier cálculo
  const tasksBySprint = useMemo(() => {
    return tasks.reduce((acc, task) => {
      // Usar "Sin Sprint" como clave por defecto si no existe la propiedad
      const sprint = task.sprint || "Sin Sprint";
      if (!acc[sprint]) acc[sprint] = [];
      acc[sprint].push(task);
      return acc;
    }, {});
  }, [tasks]);

  // Obtener nombre real del usuario lookup en el array de usuarios
  const getUserName = (id) => {
    const user = users.find(u => String(u.id) === String(id));
    return user ? user.name : "Unassigned";
  };

  // Mostrar mensaje si no hay tareas cargadas
  if (tasks.length === 0) return <p className="dashboard-empty">No hay datos disponibles</p>;

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title-main">Tasks Dashboard by Sprint</h2>

      {/* Iterar sobre cada sprint agrupado */}
      {Object.entries(tasksBySprint).map(([sprintName, sprintTasks]) => {
        
        // --- CÁLCULOS LOCALES DEL SPRINT ACTUAL ---
        const totalCompleted = sprintTasks.filter((t) => t.status === "completed").length;
        const totalAll = sprintTasks.length;
        const globalPercentage = totalAll > 0 ? Math.round((totalCompleted / totalAll) * 100) : 0;

        // Agrupar estadísticas detalladas por usuario
        const userStats = sprintTasks.reduce((stats, t) => {
          const userId = t.userId || "unassigned";

          // Inicializar estructura por usuario si es la primera vez que aparece
          if (!stats[userId]) {
            stats[userId] = {
              completed: 0, started: 0, pending: 0, total: 0,
              estimatedHours: 0, actualHours: 0
            };
          }

          // Sumar totales y horas (asegurando conversión a número)
          stats[userId].total += 1;
          stats[userId].estimatedHours += (Number(t.estimatedHours) || 0);
          stats[userId].actualHours += (Number(t.actualHours) || 0);

          // Clasificar por estado de la tarea
          if (t.status === "completed") stats[userId].completed += 1;
          else if (t.status === "in_progress") stats[userId].started += 1;
          else if (t.status === "pending") stats[userId].pending += 1;
          
          return stats;
        }, {});

        const usersIds = Object.keys(userStats);

        return (
          <section key={sprintName} className="sprint-card-block">
            {/* Título corregido para evitar duplicidad de palabra "Sprint" */}
            <h3 className="sprint-card-title">
                {sprintName === "Sin Sprint" ? sprintName : `Sprint ${sprintName.replace(/sprint\s+/i, '')}`}
            </h3>

            {/* Layout flexible de dos columnas: Tareas y Horas */}
            <div className="sprint-charts-layout">
              
              {/* Panel Izquierdo: Tasks per user */}
              <div className="panel-tasks-chart bar-chart-section">
                <h4 className="chart-title">Tasks per user</h4>
                <div className="pie-chart-viewport">
                  {usersIds.map((userId) => {
                    const { completed, started, pending, total } = userStats[userId];
                    const totalSafe = total || 1;

                    const pCompleted = (completed / totalSafe) * 100;
                    const pStarted = (started / totalSafe) * 100;
                    const pPending = (pending / totalSafe) * 100;

                    return (
                      <div key={userId} className="pie-chart-group">
                        {/* Pasamos los porcentajes como variables CSS */}
                        <div 
                          className="pie-chart" 
                          style={{ 
                            '--completed': `${pCompleted}%`, 
                            '--started': `${pStarted}%`, 
                            '--pending': `${pPending}%` 
                          }}
                        >
                          <div className="pie-chart-center"></div>
                        </div>
                        
                        <span className="chart-user-name">{getUserName(userId)}</span>
                        
                        <div className="chart-legend-details">
                          <span className="legend-item"><span className="dot-completed"></span>Completed {completed}</span>
                          <span className="legend-item"><span className="dot-started"></span>Started {started}</span>
                          <span className="legend-item"><span className="dot-pending"></span>Pending {pending}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Panel Derecho: Hours (Más ancho) */}
              <div className="panel-hours-chart bar-chart-section">
                <h4 className="chart-title">Est. vs Actual Hours</h4>
                <div className="bar-chart-viewport">
                  {usersIds.map((userId) => {
                    const { estimatedHours, actualHours } = userStats[userId];
                    // Escala dinámica basada en el valor más alto para que ambas barras sean comparables
                    const maxHours = Math.max(estimatedHours, actualHours, 1);

                    return (
                      <div key={userId} className="bar-chart-group">
                        {/* Contenedor de las barras verticales de horas */}
                        <div className="bars-vertical-container">
                          <div className="bar-track-wrapper"><div className="bar-fill estimated" style={{ height: `${(estimatedHours / maxHours) * 100}%` }}></div></div>
                          <div className="bar-track-wrapper"><div className="bar-fill actual" style={{ height: `${(actualHours / maxHours) * 100}%` }}></div></div>
                        </div>
                        {/* Nombre del usuario */}
                        <span className="chart-user-name">{getUserName(userId)}</span>
                        
                        <div className="chart-legend-details">
                          <span className="legend-item"><span className="dot-estimated"></span>Estimated {estimatedHours}h</span>
                          <span className="legend-item"><span className="dot-actual"></span>Real {actualHours}h</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Barra de progreso global del sprint */}
            <div className="sprint-global-progress">
              <p className="progress-text">Sprint Completion: {globalPercentage}%</p>
              <div className="progress-bar-container global">
                <div className="progress-bar-background">
                    <div className="progress-bar-fill" style={{ width: `${globalPercentage}%` }}></div>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default TotalCompletedTasks;