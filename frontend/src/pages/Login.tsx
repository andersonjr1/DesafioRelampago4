import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Link,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import { useEffect } from "react";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  borderRadius: theme.spacing(2),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    // A lighter background for better contrast on blue
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: theme.spacing(1),
    "& fieldset": {
      // A subtle, light border in the normal state
      borderColor: "rgba(255, 255, 255, 0.3)",
    },
    "&:hover fieldset": {
      // A more prominent border on hover for clear feedback
      borderColor: "rgba(255, 255, 255, 0.7)",
    },
    "&.Mui-focused fieldset": {
      // A solid, distinct border when the field is active
      borderColor: theme.palette.common.white,
    },
    "& .MuiOutlinedInput-input": {
      // Ensure the input text is white for readability
      color: theme.palette.common.white,
    },
  },
  "& .MuiInputLabel-root": {
    // A lighter label color for visibility against blue
    color: "rgba(255, 255, 255, 0.7)",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    // Ensure the focused label is also white and fully opaque
    color: theme.palette.common.white,
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  fontSize: "1.1rem",
  fontWeight: "bold",
  borderRadius: theme.spacing(3),
  textTransform: "none",
  margin: theme.spacing(1, 0),
  background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  "&:hover": {
    background: "linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)",
  },
}));

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useUserContext();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/session", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser({
            id: data.data.id,
            name: data.data.name,
          });
          navigate("/lobby");
        }
      } catch (err) {
        console.error("Erro ao verificar sessão", err);
      }
    };

    checkSession();
  }, [navigate, setUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Limpar erro ao digitar
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.email || !formData.password) {
      setError("Por favor, preencha todos os campos.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser({
          id: data.data.id,
          name: data.data.name,
        });
        navigate("/lobby");
      } else {
        const data = await res.json();
        setError(data.error || "Erro ao fazer login");
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao se conectar ao servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <StyledPaper elevation={6}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 3 }}
        >
          Fazer Login
        </Typography>

        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
          Entre na sua conta para jogar UNO Online!
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <StyledTextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            margin="normal"
            required
            autoComplete="email"
            autoFocus
          />

          <StyledTextField
            fullWidth
            label="Senha"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            margin="normal"
            required
            autoComplete="current-password"
          />

          <ActionButton
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </ActionButton>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Link
              component="button"
              type="button"
              variant="body2"
              onClick={handleBackToHome}
              sx={{ color: "white", textDecoration: "underline" }}
            >
              Voltar para a página inicial
            </Link>
          </Box>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Não tem uma conta?{" "}
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={() => navigate("/register")}
                sx={{ color: "white", textDecoration: "underline" }}
              >
                Criar conta
              </Link>
            </Typography>
          </Box>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default Login;
