import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Button,
  Typography,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Circle } from "@mui/icons-material";

// --- Interfaces ---
interface Card {
  color: string;
  value: string;
}

interface ColorChoiceModalProps {
  open: boolean;
  hand: Card[];
  onColorSelect: (color: string) => void;
}

interface ColorCount {
  color: string;
  count: number;
}

// --- Styled Components ---
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    minWidth: "400px",
    maxWidth: "500px",
  },
}));

const ColorGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const ColorOption = styled(Button)<{ gamecolor: string }>(
  ({ theme, gamecolor }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(1),
    padding: theme.spacing(2),
    border: `2px solid ${gamecolor}`,
    borderRadius: theme.spacing(1),
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: gamecolor,
      color: "white",
      transform: "scale(1.05)",
    },
  })
);

const ColorIcon = styled(Circle)<{ gamecolor: string }>(({ gamecolor }) => ({
  fontSize: "2rem",
  color: gamecolor,
}));

const ColorName = styled(Typography)(() => ({
  fontWeight: "bold",
  fontSize: "0.875rem",
  textAlign: "center",
}));

const CountChip = styled(Chip)(() => ({
  fontSize: "0.75rem",
  height: "20px",
}));

// --- Mapeamento de cores ---
const colorMap: { [key: string]: string } = {
  red: "#f44336",
  blue: "#2196f3",
  green: "#4caf50",
  yellow: "#ffeb3b",
  black: "#424242",
};

const colorNames: { [key: string]: string } = {
  red: "Vermelho",
  blue: "Azul",
  green: "Verde",
  yellow: "Amarelo",
  black: "Preto",
};

// --- Componente Principal ---
const ColorChoiceModal: React.FC<ColorChoiceModalProps> = ({
  open,
  hand,
  onColorSelect,
}) => {
  const [colorCounts, setColorCounts] = useState<ColorCount[]>([]);

  useEffect(() => {
    // Definir todas as cores disponíveis para escolha
    const availableColors = ["red", "blue", "green", "yellow"];
    const counts: { [key: string]: number } = {};
    
    // Inicializar todas as cores com 0
    availableColors.forEach(color => {
      counts[color] = 0;
    });
    
    // Contar cada cor na mão (se existir)
    if (hand && hand.length > 0) {
      hand.forEach((card) => {
        if (card.color && availableColors.includes(card.color)) {
          counts[card.color] = (counts[card.color] || 0) + 1;
        }
      });
    }

    // Converter para array e ordenar por contagem (maior primeiro)
    const sortedCounts = availableColors
      .map((color) => ({ color, count: counts[color] }))
      .sort((a, b) => b.count - a.count);

    setColorCounts(sortedCounts);
  }, [hand]);

  const handleColorSelect = (color: string) => {
    onColorSelect(color);
  };

  return (
    <StyledDialog
      open={open}
      disableEscapeKeyDown
      aria-labelledby="color-choice-dialog-title"
    >
      <DialogTitle id="color-choice-dialog-title">
        <Typography variant="h6" component="div" textAlign="center">
          Escolha uma Cor
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Selecione a cor que deseja jogar
        </Typography>
      </DialogTitle>

      <DialogContent>
        <ColorGrid>
          {colorCounts.map(({ color, count }) => {
            const colorValue = colorMap[color] || color;
            const colorName = colorNames[color] || color;
            
            return (
              <ColorOption
                key={color}
                gamecolor={colorValue}
                onClick={() => handleColorSelect(color)}
              >
                <ColorIcon gamecolor={colorValue} />
                <ColorName>{colorName}</ColorName>
                <CountChip
                  label={count === 0 ? 'Sem cartas' : `${count} carta${count > 1 ? 's' : ''}`}
                  size="small"
                  variant="outlined"
                />
              </ColorOption>
            );
          })}
        </ColorGrid>
      </DialogContent>
    </StyledDialog>
  );
};

export default ColorChoiceModal;