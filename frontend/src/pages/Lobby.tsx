import React from "react";
import { Box, Typography, Container, Grid, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import CreateRoom from "../components/CreateRoom";
import JoinRoom from "../components/JoinRoom";

const StyledHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  marginBottom: theme.spacing(4),
  borderRadius: theme.spacing(2),
}));

const Lobby: React.FC = () => {
  const handleCreateRoom = (roomName: string) => {
    // Gerar código da sala (simulação)
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    console.log(`Sala criada: ${roomName} (Código: ${roomCode})`);

    // Aqui você implementaria a lógica para:
    // 1. Enviar dados para o backend
    // 2. Navegar para a sala criada
    // 3. Ou mostrar o código da sala para compartilhar

    alert(
      `Sala "${roomName}" criada com sucesso!\nCódigo da sala: ${roomCode}\n\nCompartilhe este código com seus amigos!`
    );
  };

  const handleJoinRoom = (roomCode: string) => {
    console.log(`Entrando na sala: ${roomCode}`);

    // Aqui você implementaria a lógica para:
    // 1. Verificar se a sala existe no backend
    // 2. Entrar na sala
    // 3. Navegar para a tela do jogo

    alert(`Entrando na sala: ${roomCode}`);
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
      </StyledHeader>

      {/* Grid com os componentes */}
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {/* Componente Criar Sala */}
        <Grid size={{ xs: 12, md: 6 }}>
          <CreateRoom onCreateRoom={handleCreateRoom} />
        </Grid>

        {/* Componente Entrar em Sala */}
        <Grid size={{ xs: 12, md: 6 }}>
          <JoinRoom onJoinRoom={handleJoinRoom} />
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
              <Typography variant="body2">
                <Typography variant="h6" gutterBottom color="primary">
                  3. Começar a Jogar
                </Typography>
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
