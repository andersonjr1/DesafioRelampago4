import React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import GameDirection from "./GameDirection";
import GameColor from "./GameColor";

// --- Interfaces ---
interface GameInformationsProps {
  gameDirection: string;
  gameColor: {
    color: string;
    value: string;
    chosenColor?: string;
  };
}

// --- Styled Components ---
const InformationsContainer = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: theme.spacing(2),
  left: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  zIndex: 100,
}));

// --- Componente Principal ---
const GameInformations: React.FC<GameInformationsProps> = ({
  gameDirection,
  gameColor,
}) => {
  return (
    <InformationsContainer>
      <GameDirection gameDirection={gameDirection} />
      <GameColor
        color={gameColor.color}
        value={gameColor.value}
        chosenColor={gameColor.chosenColor}
      />
    </InformationsContainer>
  );
};

export default GameInformations;
