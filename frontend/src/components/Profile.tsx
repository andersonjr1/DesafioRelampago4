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

// Ícones
import StyleIcon from "@mui/icons-material/Style";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CampaignIcon from "@mui/icons-material/Campaign";

// --- Interfaces ---
interface MyProfileProps {
  name: string;
  cardCount: number;
  yelledUno: boolean;
}

// --- Animações ---
// Nova animação de pulso para o estado de AVISO (amarelo)
const pulseWarningAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 167, 38, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 167, 38, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 167, 38, 0);
  }
`;

// --- Styled Components (Reutilizados do padrão anterior) ---
type ProfileStatus = "warning" | "normal";

const ProfileCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "status",
})<{ status: ProfileStatus }>(({ theme, status }) => ({
  position: "relative",
  minWidth: 180,
  textAlign: "center",
  border: "2px solid",
  transition:
    "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, border-color 0.3s",
  // Cor da borda dinâmica adaptada para o perfil do jogador
  borderColor:
    status === "warning" ? theme.palette.warning.main : theme.palette.grey[300],
  // Animação de pulso para o estado de aviso
  animation:
    status === "warning" ? `${pulseWarningAnimation} 2s infinite` : "none",
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
const MyProfile: React.FC<MyProfileProps> = ({
  name,
  cardCount,
  yelledUno,
}) => {
  const handleYellUno = () => {
    console.log(`${name} gritou UNO!`);
  };

  // Lógica de status adaptada para o perfil do jogador
  const getStatus = (): ProfileStatus => {
    if (cardCount === 1 && !yelledUno) return "warning";
    return "normal";
  };

  const status = getStatus();
  const showYellButton = status === "warning";

  return (
    <ProfileCard elevation={2} status={status}>
      <CardContent>
        <Stack direction="column" alignItems="center" spacing={1}>
          <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
            {name.charAt(0).toUpperCase()}
          </Avatar>

          <PlayerName variant="h6">{name}</PlayerName>

          <CardCountBox>
            <StyleIcon color="action" />
            <CardCountText>{cardCount}</CardCountText>
          </CardCountBox>

          {yelledUno && (
            <UnoStatusChip
              icon={<CheckCircleIcon />}
              label="UNO Gritado!"
              size="small"
            />
          )}

          {showYellButton && (
            <Button
              variant="contained"
              color="warning"
              size="small"
              onClick={handleYellUno}
              startIcon={<CampaignIcon />}
            >
              Gritar UNO
            </Button>
          )}
        </Stack>
      </CardContent>
    </ProfileCard>
  );
};

export default MyProfile;
