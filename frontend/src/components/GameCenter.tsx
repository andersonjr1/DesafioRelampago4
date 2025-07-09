import React from "react";
import { Box, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import UnoCardFront from "./UnoCardFront"; // Seus componentes de carta
import UnoCardBack from "./UnoCardBack";

// --- Types ---
type UnoColor = "red" | "yellow" | "green" | "blue" | "black";
type UnoValue = string | number;

// --- Interfaces ---
interface GameCenterProps {
  lastPlayedCard: {
    color: string;
    value: string;
  };
  onSkipTurn?: () => void; // Prop opcional para o botão "Passar vez"
  onSelectCardBack?: () => void;
}

// --- Styled Components Modificados ---

const CenterContainer = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2147483647,
  // Adiciona um espaçamento consistente entre os itens do flex (as cartas)
  gap: theme.spacing(4),
}));

// Wrapper para a carta do baralho (monte de compra)
const DeckWrapper = styled(Box)({
  // Bônus: Mantém um leve efeito de inclinação para parecer um monte
  transform: "rotate(-8deg)",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "rotate(0deg) scale(1.05)",
  },
});

// Wrapper para a última carta jogada (monte de descarte)
const DiscardPileWrapper = styled(Box)({
  // Adiciona um efeito de hover para dar feedback ao jogador
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
  },
});

// Styled component para o botão "Passar vez"
const SkipTurnButton = styled(Button)(({ theme }) => ({
  position: "absolute",
  bottom: "-55px",
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: theme.palette.warning.main,
  color: theme.palette.warning.contrastText,
  fontWeight: "bold",
  padding: theme.spacing(0.5, 2), // Reduzido de (1, 3) para (0.5, 2)
  borderRadius: theme.spacing(2), // Reduzido de 3 para 2
  fontSize: "0.8rem", // Adicionado para reduzir o tamanho da fonte
  minWidth: "auto", // Remove largura mínima padrão
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.warning.dark,
    transform: "translateX(-50%) scale(1.05)",
  },
}));

// --- Componente Principal ---
const GameCenter: React.FC<GameCenterProps> = ({
  lastPlayedCard,
  onSkipTurn,
  onSelectCardBack,
}) => {
  return (
    <CenterContainer>
      {/* Carta do baralho (UnoCardBack) à esquerda */}
      <DeckWrapper>
        <UnoCardBack
          onSelect={
            onSelectCardBack || (() => console.log("Passar vez clicado"))
          }
        />
      </DeckWrapper>

      {/* Última carta jogada (UnoCardFront) à direita */}
      <DiscardPileWrapper>
        <UnoCardFront
          color={lastPlayedCard.color as UnoColor}
          value={lastPlayedCard.value as UnoValue}
        />
      </DiscardPileWrapper>

      {/* Botão "Passar vez" - agora sempre aparece */}
      <SkipTurnButton
        variant="contained"
        onClick={onSkipTurn || (() => console.log("Passar vez clicado"))}
      >
        Passar vez
      </SkipTurnButton>
    </CenterContainer>
  );
};

export default GameCenter;
