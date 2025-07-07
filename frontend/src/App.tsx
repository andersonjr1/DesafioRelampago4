import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Lobby from "./pages/Lobby";
import Room from "./pages/Room";
import GameHistory from "./pages/GameHistory";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import { UserProvider, useUserContext } from "./contexts/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
    background: { default: "#f5f5f5" },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function AppRoutes() {
  const { setUser } = useUserContext();

  React.useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("http://localhost:3000/session", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser({ id: data.data.id, name: data.data.name });
        }
      } catch (err) {
        console.error("Erro ao verificar sessão", err);
      }
    };

    checkSession();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/lobby"
        element={
          <ProtectedRoute>
            <Lobby />
          </ProtectedRoute>
        }
      />
      <Route
        path="/game-history"
        element={
          <ProtectedRoute>
            <GameHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/room/:code"
        element={
          <ProtectedRoute>
            <Room />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <UserProvider>
      <WebSocketProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <AppRoutes />
          </Router>
        </ThemeProvider>
      </WebSocketProvider>
    </UserProvider>
  );
}

export default App;
