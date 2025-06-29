import React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import EnemyProfile from "./EnemyProfile";

// --- Interfaces ---
interface EnemyHandProps {
  name: string;
  cardCount: number;
  yelledUno: boolean;
  disconnected: boolean;
  position: 2 | 3 | 4;
  playerId: string;
  currentPlayerId: string;
}

// --- Styled Components ---
const HandContainer = styled(Box)<{
  position: number;
  isCurrentPlayer: boolean;
}>(({ theme, position, isCurrentPlayer }) => {
  const baseStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(2),
    border: isCurrentPlayer
      ? `3px solid ${theme.palette.primary.main}`
      : "3px solid transparent",
    borderRadius: theme.spacing(1),
    backgroundColor: isCurrentPlayer
      ? "rgba(25, 118, 210, 0.1)"
      : "transparent",
    transition: "all 0.3s ease-in-out",
    boxShadow: isCurrentPlayer ? `0 0 15px rgba(25, 118, 210, 0.3)` : "none",
  };

  switch (position) {
    case 2: // Topo
      return {
        ...baseStyles,
        position: "fixed" as const,
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 100,
      };
    case 3: // Esquerda vertical
      return {
        ...baseStyles,
        position: "fixed" as const,
        left: 0,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 100,
      };
    case 4: // Direita vertical
      return {
        ...baseStyles,
        position: "fixed" as const,
        right: 0,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 100,
      };
    default:
      return {
        ...baseStyles,
      };
  }
});

const DisconnectedOverlay = styled(Box)(({ theme }) => ({
  position: "relative",
  "&::before": {
    content: '"Desconectado"',
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    color: "red",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: theme.typography.body1.fontSize,
    fontWeight: "bold",
    zIndex: 1001,
    borderRadius: theme.spacing(1),
    pointerEvents: "none",
  },
}));

// --- Componente Principal ---
const EnemyHand: React.FC<EnemyHandProps> = ({
  name,
  cardCount,
  yelledUno,
  disconnected,
  position,
  playerId,
  currentPlayerId,
}) => {
  const isCurrentPlayer = playerId === currentPlayerId;

  const content = (
    <HandContainer position={position} isCurrentPlayer={isCurrentPlayer}>
      <EnemyProfile name={name} cardCount={cardCount} yelledUno={yelledUno} />
    </HandContainer>
  );

  if (disconnected) {
    return <DisconnectedOverlay>{content}</DisconnectedOverlay>;
  }

  return content;
};

export default EnemyHand;
