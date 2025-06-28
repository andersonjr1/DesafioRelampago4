import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

// --- Interfaces ---
interface EnemyProfileProps {
  name: string;
  cardCount: number;
  yelledUno: boolean;
}

// --- Styled Components ---
const ProfileContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(1),
  minWidth: 150,
  backgroundColor: theme.palette.background.paper,
  border: `2px solid ${theme.palette.primary.main}`,
  borderRadius: theme.spacing(1),
}));

const PlayerName = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  color: theme.palette.primary.main,
  textAlign: "center",
}));

const CardCount = styled(Typography)(({ theme }) => ({
  fontSize: "1.2rem",
  fontWeight: "bold",
  color: theme.palette.text.primary,
}));

const ActionButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
  fontSize: "0.8rem",
  padding: theme.spacing(0.5, 1),
}));

// --- Componente Principal ---
const EnemyProfile: React.FC<EnemyProfileProps> = ({
  name,
  cardCount,
  yelledUno,
}) => {
  const handleReportUno = () => {
    // Lógica para denunciar que o jogador não gritou UNO
    console.log(`Denunciando que ${name} não gritou UNO!`);
    // Aqui você pode adicionar a lógica para enviar a denúncia ao backend
  };

  return (
    <ProfileContainer elevation={3}>
      <PlayerName variant="h6">{name}</PlayerName>

      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="body2" color="text.secondary">
          Cartas:
        </Typography>
        <CardCount>{cardCount}</CardCount>
      </Box>

      {!yelledUno && cardCount === 1 && (
        <ActionButton
          variant="contained"
          color="error"
          size="small"
          onClick={handleReportUno}
        >
          Falar que não gritou UNO
        </ActionButton>
      )}
    </ProfileContainer>
  );
};

export default EnemyProfile;
