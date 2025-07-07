import React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import GameDirection from "./GameDirection";
import GameColor from "./GameColor";
import RoundTimer from "./RoundTimer";

// --- Interfaces ---
interface GameInformationsProps {
  gameDirection: string;
  gameColor: {
    color: string;
    value: string;
    chosenColor?: string;
  };
  startTime: number;
  endTime: number;
}

// --- Styled Components ---
// This container is fixed to the center of the screen and centers its children.
const InformationsContainer = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: "10px",
  left: "10px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center", // This centers the items horizontally
  gap: theme.spacing(2), // A slightly larger gap for better visual spacing
  zIndex: 100,
  padding: theme.spacing(2),
  backgroundColor: "rgba(255, 255, 255, 0.8)", // Optional: add a background for better readability
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  backdropFilter: "blur(5px)",
}));

// --- Main Component ---
const GameInformations: React.FC<GameInformationsProps> = ({
  gameDirection,
  gameColor,
  startTime,
  endTime,
}) => {
  return (
    <InformationsContainer>
      <GameDirection gameDirection={gameDirection} />
      <GameColor
        color={gameColor.color}
        value={gameColor.value}
        chosenColor={gameColor.chosenColor}
      />
      <RoundTimer startTime={startTime} endTime={endTime} />
    </InformationsContainer>
  );
};

export default GameInformations;
