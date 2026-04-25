import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TotalCompletedTasks from "./TotalCompletedTasks";

// Datos base KPI equipo + usuarios
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

// Usuarios relacionados a tareas
const mockUsers = [
  { id: 1, name: "Diego" },
  { id: 2, name: "Javier" }
];

describe("TotalCompletedTasks", () => {

  test("renders sprint KPI correctly", () => {
    render(<TotalCompletedTasks tasks={mockTasks} users={mockUsers} />);

    // Sprint actual
    expect(screen.getByText(/Sprint 1/i)).toBeInTheDocument();

    // % completado del sprint
    expect(screen.getByText(/Sprint Completion: 100%/i)).toBeInTheDocument();
  });

  test("renders users involved in the sprint", () => {
    render(<TotalCompletedTasks tasks={mockTasks} users={mockUsers} />);

    // Usuarios presentes en UI
    expect(screen.getAllByText("Diego").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Javier").length).toBeGreaterThan(0);
  });

  test("renders completed tasks per user", () => {
    render(<TotalCompletedTasks tasks={mockTasks} users={mockUsers} />);

    // KPI tareas completadas por usuario
    expect(screen.getAllByText(/1 Completed/i).length).toBeGreaterThan(0);
  });

  test("renders estimated vs real hours", () => {
    render(<TotalCompletedTasks tasks={mockTasks} users={mockUsers} />);

    // Comparación horas estimadas vs reales
    expect(screen.getByText(/Estimated 5 h/i)).toBeInTheDocument();
    expect(screen.getByText(/Real Hours 6 h/i)).toBeInTheDocument();
  });

  test("renders base UI labels", () => {
    render(<TotalCompletedTasks tasks={mockTasks} users={mockUsers} />);

    // Labels principales dashboard
    expect(screen.getAllByText(/Tasks per user/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Est. vs Actual Hours/i).length).toBeGreaterThan(0);
  });

  test("snapshot dashboard", () => {
    const { container } = render(
      <TotalCompletedTasks tasks={mockTasks} users={mockUsers} />
    );

    // Estructura general UI
    expect(container).toMatchSnapshot();
  });

});