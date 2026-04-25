import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import TaskList from "./TaskList";
import { updateTask } from "../taskService"; 

// Mock del backend
vi.mock("../taskService", () => ({
  updateTask: vi.fn(() => Promise.resolve({})),
  deleteTask: vi.fn(() => Promise.resolve({}))
}));

// Datos base de tarea
const mockTasks = [
  {
    id: 1,
    title: "Task 1",
    status: "pending",
    sprint: "1",
    userId: 1,
    estimatedHours: 5,
    actualHours: 0,
    dueDate: "2026-05-01",
    priority: 3
  }
];

describe("TaskList", () => {

  test("renders basic task info", () => {
    const setTasks = vi.fn();

    render(<TaskList tasks={mockTasks} setTasks={setTasks} />);

    // Título tarea
    expect(screen.getByText("Task 1")).toBeInTheDocument();

    // Horas estimadas visibles
    expect(screen.getByText("5h")).toBeInTheDocument();
  });

  test("opens task details", async () => {
    const user = userEvent.setup();
    const setTasks = vi.fn();

    render(<TaskList tasks={mockTasks} setTasks={setTasks} />);

    // Botón detalles
    const detailsBtn = screen.getAllByRole("button", { name: /details/i })[0];
    await user.click(detailsBtn);

    // Contenido expandido
    expect(await screen.findByText(/estimated hours/i)).toBeInTheDocument();
  });

  test("completes task and updates state", async () => {
    const user = userEvent.setup();
    const setTasks = vi.fn();

    render(<TaskList tasks={mockTasks} setTasks={setTasks} />);

    // Mock input horas reales
    window.prompt = vi.fn(() => "6");

    // Acción completar
    await user.click(screen.getByRole("button", { name: /complete/i }));

    // Estado actualizado
    expect(setTasks).toHaveBeenCalled();

    // Prompt ejecutado
    expect(window.prompt).toHaveBeenCalled();
  });

  test("starts task and updates state", async () => {
    const user = userEvent.setup();
    const setTasks = vi.fn();

    render(<TaskList tasks={mockTasks} setTasks={setTasks} />);

    // click en el botón de iniciar
    const startBtn = screen.getByRole("button", { name: /start/i });
    await user.click(startBtn);

    // Verificar que el servicio backend fue llamado con el estado "in_progress"
    expect(updateTask).toHaveBeenCalled(
    expect.objectContaining({ status: "in_progress" })
    );

    expect(setTasks).toHaveBeenCalled();
  });

});