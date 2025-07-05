import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Circle } from "@mui/icons-material";
import type { Theme } from "@mui/material/styles";

// --- Interfaces ---
interface GameColorProps {
  color: string;
  value: string;
  chosenColor?: string;
}

interface ColorIconProps {
  gamecolor: string;
}

// --- Styled Components ---
const ColorContainer = styled(Box)(({ theme }: Theme) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
}));

const ColorIcon = styled(Circle)<ColorIconProps>(
  ({ gamecolor }: ColorIconProps) => ({
    fontSize: "1.5rem",
    color: gamecolor,
  })
);

const ColorText = styled(Typography)(({ theme }: Theme) => ({
  fontWeight: "bold",
  color: theme.palette.text.primary,
  fontSize: "0.875rem",
}));

// --- Mapeamento de cores ---
const colorMap: { [key: string]: string } = {
  red: "#f44336",
  blue: "#2196f3",
  green: "#4caf50",
  yellow: "#ffeb3b",
  black: "#424242",
};

// --- Componente Principal ---
const GameColor: React.FC<GameColorProps> = ({
  color,
  value,
  chosenColor,
}: GameColorProps) => {
  const displayColor = chosenColor || color;
  const colorValue = colorMap[displayColor] || displayColor;

  const getColorName = (colorKey: string) => {
    const colorNames: { [key: string]: string } = {
      red: "Vermelho",
      blue: "Azul",
      green: "Verde",
      yellow: "Amarelo",
      black: "Preto",
    };
    return colorNames[colorKey] || colorKey;
  };

  return (
    <ColorContainer>
      <ColorIcon gamecolor={colorValue} />
      <ColorText>{getColorName(displayColor)}</ColorText>
    </ColorContainer>
  );
};

export default GameColor;
