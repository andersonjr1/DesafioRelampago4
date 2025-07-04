import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ArrowCircleRight, ArrowCircleLeft } from "@mui/icons-material";

// --- Interfaces ---
interface GameDirectionProps {
  gameDirection: string;
}

// --- Styled Components ---
const DirectionContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  borderRadius: theme.spacing(1),
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  zIndex: 50,
  border: `1px solid ${theme.palette.primary.main}`,
}));

const DirectionIcon = styled(Box)<{ direction: string }>(
  ({ theme, direction }) => ({
    fontSize: "1.5rem",
    color: theme.palette.primary.main,
    animation: `rotate${
      direction === "clockwise" ? "Clockwise" : "Anticlockwise"
    } 2s linear infinite`,

    "@keyframes rotateClockwise": {
      "0%": {
        transform: "rotate(0deg)",
      },
      "100%": {
        transform: "rotate(360deg)",
      },
    },

    "@keyframes rotateAnticlockwise": {
      "0%": {
        transform: "rotate(0deg)",
      },
      "100%": {
        transform: "rotate(-360deg)",
      },
    },
  })
);

const DirectionText = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  color: theme.palette.text.primary,
  textAlign: "center",
}));

// --- Componente Principal ---
const GameDirection: React.FC<GameDirectionProps> = ({ gameDirection }) => {
  const isClockwise = gameDirection === "clockwise";

  return (
    <DirectionContainer>
      <DirectionIcon direction={gameDirection}>
        {isClockwise ? (
          <ArrowCircleRight fontSize="inherit" />
        ) : (
          <ArrowCircleLeft fontSize="inherit" />
        )}
      </DirectionIcon>

      <DirectionText variant="body2">
        Sentido {isClockwise ? "horário" : "anti-horário"}
      </DirectionText>
    </DirectionContainer>
  );
};

export default GameDirection;
