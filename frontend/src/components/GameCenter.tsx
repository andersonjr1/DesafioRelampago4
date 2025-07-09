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
  playedCards: Card[];
  direction: string;
  onSkipTurn?: () => void; // Prop opcional para o botão "Passar vez"
  onSelectCardBack?: () => void;
}

interface Card {
  color: string;
  value: string;
  chosenColor?: string;
  position?: number;
}
// --- Styled Components ---

const CenterContainer = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 10000,
  gap: theme.spacing(4),
}));

const DeckWrapper = styled(Box)({
  transform: "rotate(-8deg)",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "rotate(0deg) scale(1.05)",
  },
});

// MODIFIED: Wrapper for the discard pile
const DiscardPileWrapper = styled(Box)({
  position: "relative", // Set as the positioning context for the cards
  width: "120px", // Match card width
  height: "180px", // Match card height
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
  },
});

const SkipTurnButton = styled(Button)(({ theme }) => ({
  position: "absolute",
  bottom: "-55px",
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: theme.palette.warning.main,
  color: theme.palette.warning.contrastText,
  fontWeight: "bold",
  padding: theme.spacing(0.5, 2),
  borderRadius: theme.spacing(2),
  fontSize: "0.8rem",
  minWidth: "auto",
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
  zIndex: -1,
});

const ArrowSvg = styled("svg")({
  width: "100%",
  height: "100%",
  overflow: "visible",
  "& path": {
    fill: "none",
    stroke: "rgba(0, 0, 0, 0.7)",
    strokeWidth: 4.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  },
});

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

// --- Main Component ---
const GameCenter: React.FC<GameCenterProps> = ({
  playedCards,
  direction,
  onSkipTurn,
  onSelectCardBack,
}) => {
  // To improve performance, we only render the last 10 cards in the pile
  const visibleCards = playedCards.slice(-10);

  return (
    <CenterContainer>
      <DirectionArrows direction={direction} />

      <DeckWrapper>
        <UnoCardBack
          onSelect={onSelectCardBack || (() => console.log("Deck clicked"))}
        />
      </DeckWrapper>

      {/* MODIFIED: Discard pile now stacks cards */}
      <DiscardPileWrapper>
        {visibleCards.map((card, index) => (
          <UnoCardFront
            // Use a more stable key for React rendering
            key={`${card.color}-${card.value}-${index}`}
            color={card.color as UnoColor}
            value={card.value as UnoValue}
            chosenColor={card.chosenColor as UnoColor}
            position={card.position}
            sxCard={{
              position: "absolute",
              top: 0,
              left: 0,
              // The zIndex ensures cards with a higher index (later in the array) appear on top
              zIndex: index,
            }}
          />
        ))}
      </DiscardPileWrapper>

      {onSkipTurn && (
        <SkipTurnButton variant="contained" onClick={onSkipTurn}>
          Passar vez
        </SkipTurnButton>
      )}
    </CenterContainer>
  );
};

export default GameCenter;
