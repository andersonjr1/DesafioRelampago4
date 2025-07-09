import React from "react";
import { Box, Typography, Container, Grid, Paper, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import CreateRoom from "../components/CreateRoom";
import JoinRoom from "../components/JoinRoom";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import LogoutIcon from "@mui/icons-material/Logout";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import HistoryIcon from "@mui/icons-material/History";

const StyledHeader = styled(Paper)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(4),
  textAlign: "center",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  marginBottom: theme.spacing(4),
  borderRadius: theme.spacing(2),
}));

const LogoutButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.2, 3),
  fontSize: "1rem",
  fontWeight: "bold",
  borderRadius: theme.spacing(3),
  textTransform: "none",
  background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  color: "white",
  border: "none",
  boxShadow: "0 2px 8px 0 rgba(255, 105, 135, .12)",
  transition: "background 0.2s, box-shadow 0.25s",
  "&:hover": {
    background: "linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)",
    boxShadow: "0 8px 24px 0 rgba(0, 0, 0, .1)",
  },
}));

const HistoryButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.2, 3),
  fontSize: "1rem",
  fontWeight: "bold",
  borderRadius: theme.spacing(3),
  textTransform: "none",
  background: "linear-gradient(45deg, #9C27B0 30%, #673AB7 90%)",
  color: "white",
  border: "none",
  boxShadow: "0 2px 8px 0 rgba(156, 39, 176, .12)",
  transition: "background 0.2s, box-shadow 0.25s",
  "&:hover": {
    background: "linear-gradient(45deg, #9C27B0 60%, #673AB7 100%)",
    boxShadow: "0 8px 24px 0 rgba(0, 0, 0, .1)",
  },
}));

const ContinueGameButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  fontSize: "1.1rem",
  fontWeight: "bold",
  borderRadius: theme.spacing(3),
  textTransform: "none",
  background: "linear-gradient(45deg, #4CAF50 30%, #45a049 90%)",
  color: "white",
  border: "none",
  boxShadow: "0 4px 12px 0 rgba(76, 175, 80, .3)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(45deg, #45a049 30%, #4CAF50 90%)",
    boxShadow: "0 6px 16px 0 rgba(76, 175, 80, .4)",
    transform: "translateY(-2px)",
  },
}));

const Lobby: React.FC = () => {
  const [errorJoin, setErrorJoin] = React.useState("");
  const [errorCreate, setErrorCreate] = React.useState("");
  const [currentRoomId, setCurrentRoomId] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const { clearUser } = useUserContext();

  // Check for existing game session on mount
  React.useEffect(() => {
    const checkExistingGame = async () => {
      try {
        const response = await fetch("/api/lobby/playing", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.roomId) {
            setCurrentRoomId(data.roomId);
          }
        }
      } catch (err) {
        console.error("Error checking existing game:", err);
      }
    };

    checkExistingGame();
  }, []);

  const handleCreateRoom = async (roomName: string) => {
    try {
      setErrorCreate(""); // Clear previous errors
      const response = await fetch("/api/lobby/rooms", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomName }),
      });
      const data = await response.json();
      if (response.status === 201) {
        navigate(`/room/${data.id}`);
      } else {
        setErrorCreate(data.message || "Erro ao criar sala. Tente novamente.");
      }
    } catch (err) {
      console.error(err);
      setErrorCreate(
        "Erro de conexão. Verifique sua internet e tente novamente."
      );
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    setErrorJoin(""); // Clear previous errors
    try {
      navigate(`/room/${roomId}`);
    } catch (err) {
      console.error(err);
      setErrorJoin(
        "Erro de conexão. Verifique sua internet e tente novamente."
      );
    }
  };

  const handleContinueGame = () => {
    if (currentRoomId) {
      navigate(`/room/${currentRoomId}`);
    }
  };

  const handleGameHistory = () => {
    navigate("/game-history");
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      clearUser(); // Limpa o contexto
      navigate("/login");
    } catch (err) {
      console.error("Erro ao fazer logout", err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, position: "relative" }}>
      {/* Header do Lobby */}
      <StyledHeader elevation={6} sx={{ position: "relative" }}>
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 2,
            display: "flex",
            gap: 1,
          }}
        >
          <HistoryButton startIcon={<HistoryIcon />} onClick={handleGameHistory}>
            Histórico
          </HistoryButton>
          <LogoutButton startIcon={<LogoutIcon />} onClick={handleLogout}>
            Sair
          </LogoutButton>
        </Box>

        <Box sx={{ height: { xs: 48, md: 0 } }} />

        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Lobby de Salas
        </Typography>
        <Typography
          variant="h5"
          sx={{
            opacity: 0.9,
            textAlign: "center",
          }}
        >
          Crie uma nova sala ou entre em uma sala existente
        </Typography>
      </StyledHeader>

      {/* Continue Game Button */}
      {currentRoomId && (
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Paper sx={{ p: 3, backgroundColor: "#f8f9fa" }}>
            <Typography variant="h6" gutterBottom color="primary">
              Você tem um jogo em andamento!
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Clique no botão abaixo para continuar sua partida.
            </Typography>
            <ContinueGameButton
              startIcon={<PlayArrowIcon />}
              onClick={handleContinueGame}
            >
              Continuar Jogo
            </ContinueGameButton>
          </Paper>
        </Box>
      )}

      {/* Grid com os componentes */}
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {/* Componente Criar Sala */}
        <Grid size={{ xs: 12, md: 6 }}>
          <CreateRoom
            onCreateRoom={handleCreateRoom}
            errorMessage={errorCreate}
          />
        </Grid>

        {/* Componente Entrar em Sala */}
        <Grid size={{ xs: 12, md: 6 }}>
          <JoinRoom onJoinRoom={handleJoinRoom} errorMessage={errorJoin} />
        </Grid>
      </Grid>

      {/* Informações adicionais */}
      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
          Como funciona?
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" gutterBottom color="primary">
                1. Criar Sala
              </Typography>
              <Typography variant="body2">
                Digite um nome para sua sala e clique em "Criar Sala". Você
                receberá um código único para compartilhar com seus amigos.
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" gutterBottom color="primary">
                2. Compartilhar Código
              </Typography>
              <Typography variant="body2">
                Envie o código da sala para seus amigos através de mensagem,
                WhatsApp ou qualquer outro meio de comunicação.
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" gutterBottom color="primary">
                3. Começar a Jogar
              </Typography>
              <Typography variant="body2">
                Quando todos estiverem na sala, o criador pode iniciar a partida
                de UNO e a diversão começa!
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Lobby;
