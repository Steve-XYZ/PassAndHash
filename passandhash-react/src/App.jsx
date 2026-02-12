// src/App.jsx
import HomePage from "./pages/HomePage";
// Ya no necesitamos './App.css' aquí si los estilos son globales
// y se importan en `main.jsx` o `index.css`.

function App() {
  // App ahora no tiene estado ni lógica.
  // Su único trabajo es renderizar el layout principal o las rutas.
  return <HomePage />;
}

export default App;
