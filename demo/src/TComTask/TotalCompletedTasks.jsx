import { useMemo } from "react";
import "./TotalCompletedTasks.css";

function TotalCompletedTasks({ tasks = [], users = [] }) {
  
  // Agrupar todas las tareas por sprint antes de cualquier cálculo
  const tasksBySprint = useMemo(() => {
    return tasks.reduce((acc, task) => {
      const sprint = task.sprint || "Sin Sprint";
      if (!acc[sprint]) acc[sprint] = [];
      acc[sprint].push(task);
      return acc;
    }, {});
  }, [tasks]);

  // Obtener nombre real desde backend
  const getUserName = (id) => {
    const user = users.find(u => String(u.id) === String(id));
    return user ? user.name : "Unassigned";
  };

  // Si no hay tareas, no renderiza gráficos
  if (tasks.length === 0) return <p>No hay datos disponibles</p>;

  return (
    <div className="pending-wrapper">
      <h2 className="pending-title-main">Tasks Dashboard by Sprint</h2>

      {/* Renderizado de bloques por cada Sprint encontrado */}
      {Object.entries(tasksBySprint).map(([sprintName, sprintTasks]) => {
        
        // --- LÓGICA DE CÁLCULO LOCAL POR SPRINT ---
        const totalCompleted = sprintTasks.filter((t) => t.status === "completed").length;
        const totalAll = sprintTasks.length;
        const globalPercentage = totalAll > 0 ? Math.round((totalCompleted / totalAll) * 100) : 0;

        // Agrupar estadísticas por usuario dentro de este sprint
        const userStats = sprintTasks.reduce((stats, t) => {
          const userId = t.userId || "unassigned";

          // Inicializar estructura por usuario si no existe
          if (!stats[userId]) {
            stats[userId] = {
              completed: 0, started: 0, pending: 0, total: 0,
              estimatedHours: 0, actualHours: 0
            };
          }

          stats[userId].total += 1;

          // Sumar horas (forzando a número)
          stats[userId].estimatedHours += (Number(t.estimatedHours) || 0);
          stats[userId].actualHours += (Number(t.actualHours) || 0);

          // Clasificación por estado
          if (t.status === "completed") stats[userId].completed += 1;
          else if (t.status === "in_progress") stats[userId].started += 1;
          else if (t.status === "pending") stats[userId].pending += 1;
          
          return stats;
        }, {});

        const usersIds = Object.keys(userStats);

        return (
          <section key={sprintName} className="sprint-group">
            <h3 className="sprint-title">{sprintName === "Sin Sprint" ? sprintName : `Sprint ${sprintName}`}</h3>

            {/* Layout de dos columnas: Tareas y Horas */}
            <div className="sprint-dashboard-layout">
              
              {/* Panel de Tareas */}
              <div className="tasks-chart-panel bar-chart-section">
                <h4 className="chart-title">Tasks per user</h4>

                <div className="bar-chart">
                  {usersIds.map((userId) => {
                    const { completed, started, pending, total } = userStats[userId];
                    const totalSafe = total || 1;
                    return (
                      <div key={userId} className="bar-group">
                        <div className="bars-container">
                          <div className="bar-track"><div className="bar completed" style={{ height: `${(completed / totalSafe) * 100}%` }}></div></div>
                          <div className="bar-track"><div className="bar started" style={{ height: `${(started / totalSafe) * 100}%` }}></div></div>
                          <div className="bar-track"><div className="bar pending" style={{ height: `${(pending / totalSafe) * 100}%` }}></div></div>
                        </div>
                        <span className="user-name">{getUserName(userId)}</span>
                        
                        <div className="chart-legend-details">
                          <span className="legend-item"><span className="dot-completed"></span>{completed} Completed</span>
                          <span className="legend-item"><span className="dot-started"></span>{started} Started</span>
                          <span className="legend-item"><span className="dot-pending"></span>{pending} pending</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Panel de Horas Estimadas vs Reales */}
              <div className="hours-chart-panel bar-chart-section">
                <h4 className="chart-title">Est. vs Actual Hours</h4>
                  <div className="bar-chart">
                    {usersIds.map((userId) => {
                      const { estimatedHours, actualHours } = userStats[userId];
                      const maxHours = Math.max(estimatedHours, actualHours, 1);
                      return (
                        <div key={userId} className="bar-group">
                          <div className="bars-container">
                            <div className="bar-track"><div className="bar estimated" style={{ height: `${(estimatedHours / maxHours) * 100}%` }}></div></div>
                            <div className="bar-track"><div className="bar actual" style={{ height: `${(actualHours / maxHours) * 100}%` }}></div></div>
                          </div>
                          <span className="user-name">{getUserName(userId)}</span>
                          
                          <div className="chart-legend-details">
                            <span className="legend-item"><span className="dot-estimated"></span>Estimated {estimatedHours} h</span>
                            <span className="legend-item"><span className="dot-actual"></span>Real Hours {actualHours} h</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
              </div>

            </div>

            {/* Progreso global del sprint */}
            <div className="global-progress-section" style={{ marginTop: '20px' }}>
              <p>Sprint Completion: {globalPercentage}%</p>
              <div className="percentage-container global">
                <div className="percentage-bar"><div className="percentage-fill" style={{ width: `${globalPercentage}%` }}></div></div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default TotalCompletedTasks;