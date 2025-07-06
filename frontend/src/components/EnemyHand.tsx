import React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import EnemyProfile from "./EnemyProfile";
import type { Theme } from "@mui/material/styles";
import type { CSSObject } from "@mui/system";

// --- Interfaces ---
interface EnemyHandProps {
  name: string;
  cardCount: number;
  yelledUno: boolean;
  disconnected: boolean;
  position: number;
  playerId: string;
  currentPlayerId: string;
}
interface HandContainerProps {
  playerPosition: number;    // renomeado aqui
  isCurrentPlayer: boolean;
}

// --- Styled Components ---
const HandContainer = styled(Box, {
  shouldForwardProp: (prop: string) =>
    prop !== "playerPosition" && prop !== "isCurrentPlayer",
})<HandContainerProps>(
  ({
    theme,
    playerPosition,
    isCurrentPlayer,
  }: { theme: Theme } & HandContainerProps): CSSObject => {
    const baseStyles: CSSObject = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding:
        typeof theme.spacing(2) === "number"
          ? `${theme.spacing(2)}px`
          : theme.spacing(2),
      border: isCurrentPlayer
        ? `3px solid ${theme.palette.primary.main}`
        : "3px solid transparent",
      borderRadius:
        typeof theme.spacing(1) === "number"
          ? `${theme.spacing(1)}px`
          : theme.spacing(1),
      backgroundColor: isCurrentPlayer
        ? "rgba(25, 118, 210, 0.1)"
        : "transparent",
      transition: "all 0.3s ease-in-out",
      boxShadow: isCurrentPlayer ? `0 0 15px rgba(25, 118, 210, 0.3)` : "none",
    };

    switch (playerPosition) {
      case 3:
        return {
          ...baseStyles,
          position: "fixed",
          top: "0px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 100,
        };
      case 2:
        return {
          ...baseStyles,
          position: "fixed",
          left: "0px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 100,
        };
      case 4:
        return {
          ...baseStyles,
          position: "fixed",
          right: "0px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 100,
        };
      default:
        return baseStyles;
    }
  }
);

const DisconnectedOverlay = styled(Box)(({ theme }: { theme: Theme }) => ({
  position: "relative",
  "&::before": {
    content: '"Desconectado"',
    position: "absolute",
    top: "10px",
    left: "0px",
    right: "0px",
    bottom: "0px",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    color: "red",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: theme.typography.body1.fontSize,
    fontWeight: "bold",
    zIndex: 1001,
    borderRadius:
      typeof theme.spacing(1) === "number"
        ? `${theme.spacing(1)}px`
        : theme.spacing(1),
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
}: EnemyHandProps) => {
  const isCurrentPlayer = playerId === currentPlayerId;

  const content = (
    <HandContainer playerPosition={position} isCurrentPlayer={isCurrentPlayer}>
      <EnemyProfile
        name={name}
        cardCount={cardCount}
        yelledUno={yelledUno}
        id={playerId}
      />
    </HandContainer>
  );

  if (disconnected) {
    return <DisconnectedOverlay>{content}</DisconnectedOverlay>;
  }

  return content;
};

export default EnemyHand;
