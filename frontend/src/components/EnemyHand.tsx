import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import EnemyProfile from "./EnemyProfile";
import UnoCardBack from "./UnoCardBack";

// --- Interfaces ---
interface EnemyHandProps {
  name: string;
  cardCount: number;
  yelledUno: boolean;
  disconnected: boolean;
  position: 2 | 3 | 4;
}

// --- Styled Components ---
const HandContainer = styled(Box)<{ position: number }>(
  ({ theme, position }) => {
    const baseStyles = {
      display: "flex",
      gap: theme.spacing(1),
      padding: theme.spacing(2),
    };

    switch (position) {
      case 2: // Topo
        return {
          ...baseStyles,
          position: "fixed" as const,
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          flexDirection: "row" as const,
          alignItems: "center",
          zIndex: 100,
        };
      case 3: // Esquerda vertical
        return {
          ...baseStyles,
          position: "fixed" as const,
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          flexDirection: "column" as const,
          alignItems: "center",
          zIndex: 100,
        };
      case 4: // Direita vertical
        return {
          ...baseStyles,
          position: "fixed" as const,
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          flexDirection: "column" as const,
          alignItems: "center",
          zIndex: 100,
        };
      default:
        return {
          ...baseStyles,
          flexDirection: "column" as const,
          alignItems: "center",
        };
    }
  }
);

const CardsContainer = styled(Box)<{ position: number }>(
  ({ theme, position }) => {
    const baseStyles = {
      display: "flex",
      gap: theme.spacing(0.5),
      padding: theme.spacing(1),
    };

    switch (position) {
      case 2: // Topo - horizontal
        return {
          ...baseStyles,
          flexDirection: "row" as const,
          flexWrap: "nowrap" as const,
          overflowX: "auto" as const,
          maxWidth: "80vw",
        };
      case 3: // Esquerda - vertical
        return {
          ...baseStyles,
          flexDirection: "column" as const,
          flexWrap: "nowrap" as const,
          overflowY: "auto" as const,
          maxHeight: "80vh",
        };
      case 4: // Direita - vertical
        return {
          ...baseStyles,
          flexDirection: "column" as const,
          flexWrap: "nowrap" as const,
          overflowY: "auto" as const,
          maxHeight: "80vh",
        };
      default:
        return {
          ...baseStyles,
          flexDirection: "row" as const,
          flexWrap: "wrap" as const,
          justifyContent: "center",
        };
    }
  }
);

const DisconnectedOverlay = styled(Box)(({ theme }) => ({
  position: "relative",
  opacity: 0.5,
  filter: "grayscale(100%)",
  "&::after": {
    content: '"DESCONECTADO"',
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgba(255, 0, 0, 0.8)",
    color: "white",
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.spacing(0.5),
    fontSize: "0.8rem",
    fontWeight: "bold",
    zIndex: 10,
  },
}));

const CardWrapper = styled(Box)<{ position: number }>(({ position }) => {
  const baseStyles = {
    transformOrigin: "center",
  };

  switch (position) {
    case 2: // Topo
      return {
        ...baseStyles,
        transform: "scale(0.7)",
      };
    case 3: // Esquerda - cartas de lado
      return {
        ...baseStyles,
        transform: "scale(0.7) rotate(90deg)",
      };
    case 4: // Direita - cartas de lado
      return {
        ...baseStyles,
        transform: "scale(0.7) rotate(-90deg)",
      };
    default:
      return {
        ...baseStyles,
        transform: "scale(0.7)",
      };
  }
});

// --- Componente Principal ---
const EnemyHand: React.FC<EnemyHandProps> = ({
  name,
  cardCount,
  yelledUno,
  disconnected,
  position,
}) => {
  const renderCards = () => {
    const cards = [];
    for (let i = 0; i < cardCount; i++) {
      cards.push(
        <CardWrapper key={i} position={position}>
          <UnoCardBack />
        </CardWrapper>
      );
    }
    return cards;
  };

  const renderContent = () => {
    const profile = (
      <EnemyProfile name={name} cardCount={cardCount} yelledUno={yelledUno} />
    );
    const cards =
      cardCount > 0 ? (
        <CardsContainer position={position}>{renderCards()}</CardsContainer>
      ) : (
        <Typography
          variant="body2"
          color="text.secondary"
          style={{ fontStyle: "italic" }}
        >
          Sem cartas
        </Typography>
      );

    switch (position) {
      case 2: // Topo - perfil à esquerda das cartas
        return (
          <HandContainer position={position}>
            {profile}
            {cards}
          </HandContainer>
        );
      case 3: // Esquerda - perfil em cima das cartas
        return (
          <HandContainer position={position}>
            {profile}
            {cards}
          </HandContainer>
        );
      case 4: // Direita - perfil em baixo das cartas
        return (
          <HandContainer position={position}>
            {cards}
            {profile}
          </HandContainer>
        );
      default:
        return (
          <HandContainer position={position}>
            {profile}
            {cards}
          </HandContainer>
        );
    }
  };

  const content = renderContent();

  if (disconnected) {
    return <DisconnectedOverlay>{content}</DisconnectedOverlay>;
  }

  return content;
};

export default EnemyHand;
