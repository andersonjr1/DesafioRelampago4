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
  direction: string;
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
  zIndex: 10000,
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

const ArrowContainer = styled(Box)({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  width: "50px",
  height: "150px",
  zIndex: -1, // Coloca as setas atrás das cartas, se necessário
});

const ArrowSvg = styled("svg")({
  width: "100%",
  height: "100%",
  overflow: "visible",
  "& path": {
    fill: "none",
    stroke: "black",
    strokeWidth: 4.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  },
});

// Paths SVG para as setas
const ARROW_PATHS = {
  clockwise: {
    left: "M 40 125 C 20 95, 20 55, 40 25 L 32 40 M 40 25 L 48 40",
    right: "M 10 25 C 30 55, 30 95, 10 125 L 18 110 M 10 125 L 2 110",
  },
  anticlockwise: {
    left: "M 40 25 C 20 55, 20 95, 40 125 L 32 110 M 40 125 L 48 110",
    right: "M 10 125 C 30 95, 30 55, 10 25 L 18 40 M 10 25 L 2 40",
  },
};

const DirectionArrows: React.FC<{ direction: string }> = ({ direction }) => {
  const paths =
    ARROW_PATHS[direction as keyof typeof ARROW_PATHS] || ARROW_PATHS.clockwise;

  return (
    <>
      <ArrowContainer sx={{ left: "-80px" }}>
        <ArrowSvg viewBox="0 0 50 150">
          <path d={paths.left} />
        </ArrowSvg>
      </ArrowContainer>
      <ArrowContainer sx={{ right: "-80px" }}>
        <ArrowSvg viewBox="0 0 50 150">
          <path d={paths.right} />
        </ArrowSvg>
      </ArrowContainer>
    </>
  );
};

// --- Componente Principal ---
const GameCenter: React.FC<GameCenterProps> = ({
  lastPlayedCard,
  direction,
  onSkipTurn,
  onSelectCardBack,
}) => {
  return (
    <CenterContainer>
      {/* Indicador de direção adicionado aqui */}
      <DirectionArrows direction={direction} />

      {/* Carta do baralho (UnoCardBack) à esquerda */}
      <DeckWrapper>
        <UnoCardBack
          onSelect={
            onSelectCardBack || (() => console.log("Carta do baralho clicada"))
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

      {/* Botão "Passar vez" */}
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
