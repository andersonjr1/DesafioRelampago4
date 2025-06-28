import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Profile from "./Profile";
import UnoCardFront from "./UnoCardFront";

// --- Interfaces ---
interface Card {
  color: string;
  value: string;
}

interface UserHandProps {
  name: string;
  cardCount: number;
  yelledUno: boolean;
  hand: Card[];
}

// --- Styled Components ---
const HandContainer = styled(Box)(({ theme }) => ({
  position: "fixed",
  bottom: 0,
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  zIndex: 100,
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  borderRadius: `${theme.spacing(1)} ${theme.spacing(1)} 0 0`,
  boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
}));

const CardsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "nowrap",
  overflowX: "auto",
  justifyContent: "flex-start",
  gap: theme.spacing(0.5),

  padding: theme.spacing(2, 1),

  width: "content",
  maxWidth: "75vw",
  boxSizing: "border-box",

  "&::-webkit-scrollbar": {
    height: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: "10px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
}));

const CardWrapper = styled(Box)(() => ({
  transform: "scale(0.7)",
  transformOrigin: "center",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(0.85)",
    zIndex: 1,
  },
}));

// --- Componente Principal ---
const UserHand: React.FC<UserHandProps> = ({
  name,
  cardCount,
  yelledUno,
  hand,
}) => {
  const handleCardSelect = (cardIndex: number) => {
    // Lógica para selecionar uma carta
    console.log(
      `Carta selecionada: ${hand[cardIndex].color} ${hand[cardIndex].value}`
    );
    // Aqui você pode adicionar a lógica para jogar a carta
  };

  return (
    <HandContainer>
      <Profile name={name} cardCount={cardCount} yelledUno={yelledUno} />
      
      {hand.length > 0 && (
        <CardsContainer>
          {hand.map((card, index) => (
            <CardWrapper key={index}>
              <UnoCardFront
                color={card.color as any}
                value={card.value as any}
                onSelect={() => handleCardSelect(index)}
              />
            </CardWrapper>
          ))}
        </CardsContainer>
      )}

      {hand.length === 0 && (
        <Typography
          variant="body2"
          color="text.secondary"
          style={{ fontStyle: "italic" }}
        >
          Sem cartas na mão
        </Typography>
      )}
    </HandContainer>
  );
};

export default UserHand;
