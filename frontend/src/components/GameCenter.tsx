import React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import UnoCardFront from "./UnoCardFront"; // Seus componentes de carta
import UnoCardBack from "./UnoCardBack";

// --- Interfaces ---
interface GameCenterProps {
  lastPlayedCard: {
    color: string;
    value: string;
  };
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
  zIndex: 10,
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

// --- Componente Principal ---
const GameCenter: React.FC<GameCenterProps> = ({ lastPlayedCard }) => {
  return (
    <CenterContainer>
      {/* Carta do baralho (UnoCardBack) à esquerda */}
      <DeckWrapper>
        <UnoCardBack />
      </DeckWrapper>

      {/* Última carta jogada (UnoCardFront) à direita */}
      <DiscardPileWrapper>
        <UnoCardFront
          color={lastPlayedCard.color as any}
          value={lastPlayedCard.value as any}
        />
      </DiscardPileWrapper>
    </CenterContainer>
  );
};

export default GameCenter;
