import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  Stack,
  Box,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";

// Ícones para uma melhor representação visual
import StyleIcon from "@mui/icons-material/Style"; // Ícone de cartas empilhadas
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Ícone de sucesso
import CampaignIcon from "@mui/icons-material/Campaign"; // Ícone para "gritar" ou "denunciar"
import { useWebSocketContext } from "../contexts/WebSocketContext";

// --- Interfaces ---
interface EnemyProfileProps {
  id: string;
  name: string;
  cardCount: number;
  yelledUno: boolean;
}

// --- Animações ---
const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(211, 47, 47, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(211, 47, 47, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(211, 47, 47, 0);
  }
`;

// --- Styled Components ---
type ProfileStatus = "danger" | "warning" | "normal";

const ProfileCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "status",
})<{ status: ProfileStatus }>(({ theme, status }) => ({
  position: "relative",
  minWidth: 180,
  textAlign: "center",
  border: "2px solid",
  transition:
    "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, border-color 0.3s",
  // Cor da borda dinâmica baseada no status do jogador
  borderColor:
    status === "danger"
      ? theme.palette.error.main
      : status === "warning"
      ? theme.palette.warning.main
      : theme.palette.grey[300],
  // Animação de pulso para o estado de perigo
  animation: status === "danger" ? `${pulseAnimation} 2s infinite` : "none",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: theme.shadows[10],
  },
}));

const PlayerName = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
}));

const CardCountBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(1),
  margin: theme.spacing(1.5, 0),
}));

const CardCountText = styled(Typography)(({ theme }) => ({
  fontSize: "2rem",
  fontWeight: "bold",
  lineHeight: 1,
  color: theme.palette.text.primary,
}));

const UnoStatusChip = styled(Chip)(({ theme }) => ({
  marginTop: theme.spacing(1),
  fontWeight: "bold",
  color: theme.palette.success.contrastText,
  backgroundColor: theme.palette.success.main,
}));

// --- Componente Principal ---
const EnemyProfile: React.FC<EnemyProfileProps> = ({
  id,
  name,
  cardCount,
  yelledUno,
}) => {
  const { sendMessage } = useWebSocketContext();
  const handleReportUno = () => {
    sendMessage(JSON.stringify({ type: "ACCUSE_NO_UNO", playerId: id }));
  };

  // Determina o status do jogador para aplicar estilos dinâmicos
  const getStatus = (): ProfileStatus => {
    if (cardCount === 1 && !yelledUno) return "danger";
    if (cardCount > 0 && cardCount <= 2) return "warning";
    return "normal";
  };

  const status = getStatus();
  const showReportButton = status === "danger";
  return (
    <ProfileCard elevation={2} status={status}>
      <CardContent>
        <Stack direction="column" alignItems="center" spacing={1}>
          <Avatar sx={{ bgcolor: "secondary.main", width: 56, height: 56 }}>
            {name.charAt(0).toUpperCase()}
          </Avatar>

          <PlayerName variant="h6">{name}</PlayerName>

          <CardCountBox>
            <StyleIcon color="action" />
            <CardCountText>{cardCount}</CardCountText>
          </CardCountBox>

          {cardCount === 1 && yelledUno && (
            <UnoStatusChip
              icon={<CheckCircleIcon />}
              label="UNO!"
              size="small"
            />
          )}

          {showReportButton && (
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={handleReportUno}
              startIcon={<CampaignIcon />}
            >
              Não gritou UNO!
            </Button>
          )}
        </Stack>
      </CardContent>
    </ProfileCard>
  );
};

export default EnemyProfile;
