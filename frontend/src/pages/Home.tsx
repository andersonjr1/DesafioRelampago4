import React from "react";
import { Box, Typography, Button, Container, Paper, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  marginBottom: theme.spacing(4),
}));

const UnoCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: "center",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
}));

const ActionButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  fontSize: "1.1rem",
  fontWeight: "bold",
  borderRadius: theme.spacing(3),
  textTransform: "none",
  margin: theme.spacing(1),
}));

const Home: React.FC = () => {
  const handleLogin = () => {
    // Navegar para tela de login
    console.log("Navegando para login");
  };

  const handleRegister = () => {
    // Navegar para tela de registro
    console.log("Navegando para registro");
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Principal */}
      <StyledPaper elevation={6}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Bem-vindo ao UNO Online!
        </Typography>
        <Typography variant="h5" sx={{ mb: 3, opacity: 0.9 }}>
          O jogo de cartas mais divertido do mundo, agora na sua tela!
        </Typography>

        {/* Botões de Ação */}
        <Box sx={{ mt: 4 }}>
          <ActionButton
            variant="contained"
            color="secondary"
            size="large"
            onClick={handleLogin}
            sx={{
              background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
              "&:hover": {
                background: "linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)",
              },
            }}
          >
            Fazer Login
          </ActionButton>

          <ActionButton
            variant="outlined"
            size="large"
            onClick={handleRegister}
            sx={{
              color: "white",
              borderColor: "white",
              "&:hover": {
                borderColor: "white",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Criar Conta
          </ActionButton>
        </Box>
      </StyledPaper>

      {/* Seção Sobre o UNO */}
      <Typography
        variant="h3"
        component="h2"
        textAlign="center"
        gutterBottom
        sx={{ mb: 4, fontWeight: "bold" }}
      >
        Sobre o UNO
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <UnoCard elevation={3}>
            <Typography
              variant="h5"
              component="h3"
              gutterBottom
              color="primary"
              sx={{ fontWeight: "bold" }}
            >
              🎯 Como Jogar
            </Typography>
            <Typography variant="body1">
              O objetivo é ser o primeiro a descartar todas as suas cartas.
              Combine cores ou números, use cartas especiais estrategicamente e
              não esqueça de gritar "UNO!" quando tiver apenas uma carta!
            </Typography>
          </UnoCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <UnoCard elevation={3}>
            <Typography
              variant="h5"
              component="h3"
              gutterBottom
              color="primary"
              sx={{ fontWeight: "bold" }}
            >
              🌟 Cartas Especiais
            </Typography>
            <Typography variant="body1">
              Pular, Inverter, +2, +4, Coringa... Cada carta especial pode mudar
              completamente o rumo do jogo. Use-as com sabedoria para
              surpreender seus oponentes!
            </Typography>
          </UnoCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <UnoCard elevation={3}>
            <Typography
              variant="h5"
              component="h3"
              gutterBottom
              color="primary"
              sx={{ fontWeight: "bold" }}
            >
              👥 Multijogador
            </Typography>
            <Typography variant="body1">
              Jogue com amigos ou desafie jogadores do mundo todo! Salas
              privadas, partidas ranqueadas e muito mais. A diversão nunca
              acaba!
            </Typography>
          </UnoCard>
        </Grid>
      </Grid>

      {/* Seção de Recursos */}
      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Por que jogar UNO Online?
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography
              variant="h6"
              color="primary"
              sx={{ fontWeight: "bold" }}
            >
              ⚡ Rápido
            </Typography>
            <Typography>Partidas de 5-15 minutos</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography
              variant="h6"
              color="primary"
              sx={{ fontWeight: "bold" }}
            >
              🎮 Fácil
            </Typography>
            <Typography>Interface intuitiva</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="h6"
              color="primary"
              sx={{ fontWeight: "bold" }}
            >
              🌍 Global
            </Typography>
            <Typography>Jogadores do mundo todo</Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
