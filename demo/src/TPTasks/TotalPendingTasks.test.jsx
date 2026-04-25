import { render, screen } from "@testing-library/react";
import TotalPendingTasks from "./TotalPendingTasks";

const mockData = {
  tasks: [
    {
      id: 1,
      title: "Hacer login",
      status: "pending",
      userId: 1,
      sprint: "Sprint 1"
    },
    {
      id: 2,
      title: "Diseñar UI",
      status: "completed",
      userId: 2,
      sprint: "Sprint 2"
    },
    {
      id: 4,
      title: "Crear endpoints API",
      status: "pending",
      userId: 4,
      sprint: "Sprint 2"
    }
  ],
  users: [
    { id: 1, name: "Diego" },
    { id: 2, name: "Javier" },
    { id: 4, name: "Álvaro" }
  ]
};

test("should render only pending tasks", () => {
  
  // Renderizar componente con datos mock
  render(
    <TotalPendingTasks
      tasks={mockData.tasks}
      setTasks={() => {}} // función mock
      users={mockData.users}
    />
  );

  // Verificar tareas pendientes visibles
  expect(screen.getByText("Hacer login")).toBeInTheDocument();
  expect(screen.getByText("Crear endpoints API")).toBeInTheDocument();

  // Verificar tarea completada NO visible
  expect(screen.queryByText("Diseñar UI")).not.toBeInTheDocument();
});