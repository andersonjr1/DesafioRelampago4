import React from "react";
import { Box, Typography, Container, Grid, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import CreateRoom from "../components/CreateRoom";
import JoinRoom from "../components/JoinRoom";
import { useNavigate } from "react-router-dom";
import { ReadyState } from "react-use-websocket";
import { useWebSocketContext } from "../contexts/WebSocketContext";
import { useUserContext } from "../contexts/UserContext";

const StyledHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  marginBottom: theme.spacing(4),
  borderRadius: theme.spacing(2),
}));

const Lobby: React.FC = () => {
  const [errorJoin, setErrorJoin] = React.useState("");
  const navigate = useNavigate();
  const { sendMessage, lastMessage, readyState, connectionStatus } =
    useWebSocketContext();
  const { updateUserFromWebSocket } = useUserContext();

  // Handle incoming messages
  React.useEffect(() => {
    if (lastMessage !== null) {
      try {
        const data = JSON.parse(lastMessage.data);

        switch (data.type) {
          case "CREATE_ROOM":
            updateUserFromWebSocket(data);
            navigate(`/room/${data.room.id}`);
            break;
          case "JOIN_ROOM":
            console.log(data);
            if (!data.success) {
              setErrorJoin(data.message);
              return;
            }
            updateUserFromWebSocket(data);
            navigate(`/room/${data.room.id}`);
            break;
          default:
            console.log("Unknown message type:", data);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    }
  }, [lastMessage, navigate]);

  const handleCreateRoom = (roomName: string) => {
    if (readyState === ReadyState.OPEN) {
      sendMessage(JSON.stringify({ type: "CREATE_ROOM", roomName }));
    }
  };

  const handleJoinRoom = (roomId: string) => {
    if (readyState === ReadyState.OPEN) {
      sendMessage(JSON.stringify({ type: "JOIN_ROOM", roomId }));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, position: "relative" }}>
      {/* Header do Lobby */}
      <StyledHeader elevation={6}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Lobby de Salas
        </Typography>
        <Typography variant="h5" sx={{ opacity: 0.9 }}>
          Crie uma nova sala ou entre em uma sala existente
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, opacity: 0.7 }}>
          Connection Status: {connectionStatus}
        </Typography>
      </StyledHeader>

      {/* Grid com os componentes */}
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {/* Componente Criar Sala */}
        <Grid size={{ xs: 12, md: 6 }}>
          <CreateRoom onCreateRoom={handleCreateRoom} />
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
