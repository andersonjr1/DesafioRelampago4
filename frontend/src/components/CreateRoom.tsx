import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: "center",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  borderRadius: theme.spacing(2),
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
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
  padding: theme.spacing(1.5, 3),
  fontSize: "1rem",
  fontWeight: "bold",
  borderRadius: theme.spacing(3),
  textTransform: "none",
  marginTop: theme.spacing(2),
  background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  "&:hover": {
    background: "linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)",
  },
  "&:disabled": {
    background: "rgba(255, 255, 255, 0.3)",
    color: "rgba(255, 255, 255, 0.7)",
  },
}));

interface CreateRoomProps {
  onCreateRoom?: (roomName: string) => void;
}

const CreateRoom: React.FC<CreateRoomProps> = ({ onCreateRoom }) => {
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomName.trim()) {
      setError("Por favor, digite um nome para a sala.");
      return;
    }

    if (roomName.trim().length < 3) {
      setError("O nome da sala deve ter pelo menos 3 caracteres.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Simular criação de sala
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (onCreateRoom) {
        onCreateRoom(roomName.trim());
      }

      // Limpar o campo após criar
      setRoomName("");
    } catch (err) {
      setError("Erro ao criar sala. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value);
    setError(""); // Limpar erro ao digitar
  };

  return (
    <StyledPaper elevation={6}>
      <AddIcon sx={{ fontSize: 48, mb: 2, opacity: 0.8 }} />

      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 3 }}
      >
        Criar Nova Sala
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
        >
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
        <StyledTextField
          fullWidth
          label="Nome da Sala"
          value={roomName}
          onChange={handleInputChange}
          placeholder="Digite o nome da sua sala"
          margin="normal"
          required
          disabled={loading}
          inputProps={{ maxLength: 50 }}
        />

        <ActionButton
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading || !roomName.trim()}
          startIcon={<AddIcon />}
        >
          {loading ? "Criando..." : "Criar Sala"}
        </ActionButton>
      </Box>

      <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
        Crie uma sala personalizada para jogar com seus amigos!
      </Typography>
    </StyledPaper>
  );
};

export default CreateRoom;
