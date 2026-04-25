import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TotalCompletedTasks from "./TotalCompletedTasks";

// Mock de tareas (datos base para KPIs)
const mockTasks = [
  {
    id: 1,
    title: "Task 1",
    status: "completed",
    sprint: "1",
    userId: 1,
    estimatedHours: 5,
    actualHours: 6
  },
  {
    id: 2,
    title: "Task 2",
    status: "completed",
    sprint: "1",
    userId: 2,
    estimatedHours: 3,
    actualHours: 2
  }
];

// Mock de usuarios
const mockUsers = [
  { id: 1, name: "Diego" },
  { id: 2, name: "Javier" }
];

test("renders KPIs per sprint and per user", () => {
  // Renderizar componente con datos simulados
  render(<TotalCompletedTasks tasks={mockTasks} users={mockUsers} />);

  // ===== KPI EQUIPO =====

  // Verificar sprint visible
  expect(screen.getByText(/Sprint 1/i)).toBeInTheDocument();

  // Verificar % de tareas completadas (2 de 2 → 100%)
  expect(screen.getByText(/Sprint Completion: 100%/i)).toBeInTheDocument();

  // KPI POR PERSONA

  // Verificar nombres de usuarios (sin asumir cantidad exacta)
  expect(screen.getAllByText("Diego").length).toBeGreaterThan(0);
  expect(screen.getAllByText("Javier").length).toBeGreaterThan(0);

  // Verificar tareas completadas por usuario
  expect(screen.getAllByText(/1 Completed/i).length).toBeGreaterThan(0);

  // Verificar horas trabajadas (Estimated vs Real)
  expect(screen.getByText(/Estimated 5 h/i)).toBeInTheDocument();
  expect(screen.getByText(/Real Hours 6 h/i)).toBeInTheDocument();

  // UI BASE (evitar depender de implementación interna)

  // Verificar labels principales
  expect(screen.getAllByText(/Tasks per user/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/Est. vs Actual Hours/i).length).toBeGreaterThan(0);
});