import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

// Mock backend de tareas y usuarios
vi.mock("./taskService", () => ({
  getTasks: vi.fn(() =>
    Promise.resolve([
      { id: 1, title: "Hacer login", userId: 1 },
      { id: 2, title: "Diseñar UI", userId: 2 }
    ])
  ),
  getUsers: vi.fn(() => Promise.resolve([])) // Define el mock
}));

// Mock login (usuario fijo)
vi.mock("./Login/Login", () => ({
  default: ({ onLogin }) => (
    <button onClick={() => onLogin({ id: 1, name: "Diego" })}>
      Login Diego
    </button>
  )
}));

describe("App", () => {

  test("login flow and user selection", async () => {
    render(<App />);

    // Abrir login
    screen.getByText(/login/i).click();

    // Botón mock login
    const loginBtn = await screen.findByText("Login Diego");
    expect(loginBtn).toBeInTheDocument();
  });

  test("renders tasks for logged user only", async () => {
    render(<App />);

    // Flujo login
    screen.getByText(/login/i).click();
    const loginBtn = await screen.findByText("Login Diego");
    loginBtn.click();

    // Tareas del usuario logueado
    expect(await screen.findByText("Hacer login")).toBeInTheDocument();

    // Tareas de otros usuarios ocultas
    expect(screen.queryByText("Diseñar UI")).not.toBeInTheDocument();
  });

});