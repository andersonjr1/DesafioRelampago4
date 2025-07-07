import React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import EnemyProfile from "./EnemyProfile";
import WifiOffIcon from "@mui/icons-material/WifiOff";
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
  playerPosition: number;
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

// --- Main Component ---
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

  return (
    <HandContainer playerPosition={position} isCurrentPlayer={isCurrentPlayer}>
      {/* This Box acts as a positioning context for the overlay */}
      <Box sx={{ position: "relative", display: "flex" }}>
        <EnemyProfile
          name={name}
          cardCount={cardCount}
          yelledUno={yelledUno}
          id={playerId}
        />
        {/* Conditionally render the disconnected overlay */}
        {disconnected && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(30, 30, 30, 0.6)",
              backdropFilter: "blur(2px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
              // Ensure the overlay has the same border radius as its container
              borderRadius: (theme) =>
                typeof theme.spacing(1) === "number"
                  ? `${theme.spacing(1)}px`
                  : theme.spacing(1),
            }}
          >
            <WifiOffIcon
              sx={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "2.5rem" }}
            />
          </Box>
        )}
      </Box>
    </HandContainer>
  );
};

export default EnemyHand;
