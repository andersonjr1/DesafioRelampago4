import React from "react";
import { Box, Typography, Container, Grid, Paper, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import CreateRoom from "../components/CreateRoom";
import JoinRoom from "../components/JoinRoom";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import LogoutIcon from "@mui/icons-material/Logout";

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
  const [errorCreate, setErrorCreate] = React.useState("");
  const navigate = useNavigate();
  const { clearUser } = useUserContext();

  const handleCreateRoom = async (roomName: string) => {
    try {
      setErrorCreate(""); // Clear previous errors
      const response = await fetch("http://localhost:3000/lobby/rooms", {
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

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/auth/logout", {
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

        <Box sx={{ position: "absolute", top: 16, right: 16 }}>
          <Button
            variant="outlined"
            color="warning"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Sair
          </Button>
        </Box>
      </StyledHeader>

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
