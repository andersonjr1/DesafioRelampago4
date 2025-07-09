import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import LoginIcon from "@mui/icons-material/Login";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: "center",
  background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
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
  background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
  "&:hover": {
    background: "linear-gradient(45deg, #2196F3 60%, #21CBF3 100%)",
  },
  "&:disabled": {
    background: "rgba(255, 255, 255, 0.3)",
    color: "rgba(255, 255, 255, 0.7)",
  },
}));

type GameStatus = "WAITING" | "IN_GAME" | "FINISHED";
type GameDirection = "clockwise" | "anticlockwise";
type AdditionalState = "CHOOSING_COLOR" | "PLAYER_DISCONNECTED" | null;

interface Card {
  color: string;
  value: string;
  chosenColor?: string;
}
interface RoomStateForApi {
  id: string;
  roomName: string;
  ownerId: string;
  status: GameStatus;
  canStart: boolean;
  currentCard?: Card;
  gameDirection?: GameDirection;
  currentPlayerId?: string;
  additionalState?: AdditionalState;
  players: {
    id: string;
    name: string;
    cardCount: number;
    isTheirTurn: boolean;
    disconnected: boolean;
    yelledUno: boolean;
    alreadyBought: boolean;
    isOnline: boolean;
  }[];
  playerHand?: Card[];
}

interface JoinRoomProps {
  onJoinRoom?: (roomCode: string) => void;
  errorMessage?: string;
}

const JoinRoom: React.FC<JoinRoomProps> = ({ onJoinRoom, errorMessage }) => {
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setError(errorMessage || "");
  }, [errorMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    const trimmedRoom = roomCode.trim();

    if (!trimmedRoom) {
      setError("Por favor, digite o código da sala.");
      return;
    }

    if (trimmedRoom.length < 4) {
      setError("O código da sala deve ter pelo menos 4 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/lobby/rooms", {
        credentials: "include",
      });

      if (!response.ok) {
        setError("Erro ao buscar as salas");

        setRoomCode("");
        return;
      }

      const roomsData = await response.json();
      const inputRoomId = trimmedRoom.toLowerCase();

      const foundRoom = roomsData.find(
        (r: RoomStateForApi) => r.id.trim().toLowerCase() === inputRoomId
      );

      if (!foundRoom) {
        setError("Sala não existe");

        setRoomCode("");
        return;
      }

      if (onJoinRoom) {
        onJoinRoom(trimmedRoom.toUpperCase());
      }

      // Limpar o campo após entrar
      setRoomCode("");
    } catch (err) {
      setError("Erro ao entrar na sala. Tente novamente.");

      setRoomCode("");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Converter para maiúsculas e limitar caracteres
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    setRoomCode(value);
  };

  return (
    <StyledPaper elevation={6}>
      <LoginIcon sx={{ fontSize: 48, mb: 2, opacity: 0.8 }} />

      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 3 }}
      >
        Entrar em Sala
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
          label="Código da Sala"
          value={roomCode}
          onChange={handleInputChange}
          placeholder="Ex: ABC123"
          margin="normal"
          required
          disabled={loading}
          inputProps={{
            maxLength: 10,
            style: {
              textTransform: "uppercase",
              textAlign: "center",
              fontSize: "1.2rem",
              letterSpacing: "2px",
            },
          }}
        />

        <ActionButton
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading || !roomCode.trim()}
          startIcon={<LoginIcon />}
        >
          {loading ? "Entrando..." : "Entrar na Sala"}
        </ActionButton>
      </Box>

      <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
        Digite o código da sala que você recebeu do criador!
      </Typography>
    </StyledPaper>
  );
};

export default JoinRoom;
