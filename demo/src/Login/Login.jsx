import { useState, useEffect } from "react";
import { getUsers } from "../taskService";
import "./Login.css";

// Componente de login que permite seleccionar o ingresar un usuario por ID
function Login({ onLogin, onClose }) {
  // Estado para el input de ID
  const [userId, setUserId] = useState("");

  // Lista de usuarios obtenida del backend
  const [users, setUsers] = useState([]);

  // Control de error si el usuario no existe
  const [error, setError] = useState(false);

  // Carga inicial de usuarios al montar el componente
  useEffect(() => {
    loadUsers();
  }, []);

  // Función para obtener usuarios desde el backend
  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Manejo del submit cuando se ingresa un ID manualmente
  const handleSubmit = (e) => {
    e.preventDefault();

    const user = users.find(u => String(u.id) === String(userId));

    if (user) {
      onLogin(user);
    } else {
      setError(true);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-card">
        
        {/* Botón para cerrar el modal */}
        <button className="close-x" onClick={onClose}>×</button>

        <h2>Select User</h2>

        {/* Lista de usuarios obtenidos del backend */}
        <div className="user-list">
          {users.map(u => (
            <button
              key={u.id}
              className="btn-user"
              onClick={() => onLogin(u)}
            >
              {u.name} (ID: {u.id})
            </button>
          ))}
        </div>

        {/* Formulario para ingresar ID manualmente */}
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            placeholder="Enter your user ID..."
            value={userId}
            onChange={(e) => {
              setUserId(e.target.value);
              setError(false);
            }}
          />

          <button type="submit" className="btn-main">
            Enter
          </button>
        </form>

        {/* Mensaje de error si no se encuentra el usuario */}
        {error && (
          <p style={{ color: "red" }}>
            User not found
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;