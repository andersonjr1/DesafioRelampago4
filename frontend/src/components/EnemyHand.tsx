import React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import EnemyProfile from "./EnemyProfile";

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
      justifyContent: "center",
      alignItems: "center",
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
          zIndex: 100,
        };
      case 3: // Esquerda vertical
        return {
          ...baseStyles,
          position: "fixed" as const,
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 100,
        };
      case 4: // Direita vertical
        return {
          ...baseStyles,
          position: "fixed" as const,
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 100,
        };
      default:
        return {
          ...baseStyles,
        };
    }
  }
);

const CardsContainer = styled(Box)<{ position: number }>(
  ({ theme, position }) => {
    const baseStyles = {
      display: "flex",
      overflowX: "auto" as const,
      overflowY: "auto" as const,
      gap: theme.spacing(0.5),
      padding: theme.spacing(1),
      maxWidth: "90vw",
      maxHeight: "80vh",
      boxSizing: "border-box" as const,

      "&::-webkit-scrollbar": {
        width: "8px",
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
    };

    switch (position) {
      case 2: // Topo - horizontal
        return {
          ...baseStyles,
          flexDirection: "row" as const,
          justifyContent: "center",
          alignItems: "center",
        };
      case 3: // Esquerda - vertical
      case 4: // Direita - vertical
        return {
          ...baseStyles,
          flexDirection: "column" as const,
          justifyContent: "center",
          alignItems: "center",
        };
      default:
        return {
          ...baseStyles,
          flexDirection: "row" as const,
          justifyContent: "center",
          alignItems: "center",
        };
    }
  }
);

const DisconnectedOverlay = styled(Box)(({ theme }) => ({
  position: "relative",
  "&::after": {
    content: '"Desconectado"',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: theme.typography.h6.fontSize,
    fontWeight: "bold",
    zIndex: 1000,
  },
}));

const CardWrapper = styled(Box)<{ position: number }>(({ position }) => {
  const baseStyles = {
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
      zIndex: 1,
    },
  };

  switch (position) {
    case 2: // Topo - cartas horizontais menores
      return {
        ...baseStyles,
        transform: "scale(0.6)",
        transformOrigin: "center",
      };
    case 3: // Esquerda - cartas verticais rotacionadas
      return {
        ...baseStyles,
        transform: "rotate(90deg) scale(0.5)",
        transformOrigin: "center",
      };
    case 4: // Direita - cartas verticais rotacionadas para o outro lado
      return {
        ...baseStyles,
        transform: "rotate(-90deg) scale(0.5)",
        transformOrigin: "center",
      };
    default:
      return {
        ...baseStyles,
        transform: "scale(0.8)",
        transformOrigin: "center",
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
  const content = (
    <HandContainer position={position}>
      <EnemyProfile name={name} cardCount={cardCount} yelledUno={yelledUno} />
    </HandContainer>
  );

  if (disconnected) {
    return <DisconnectedOverlay>{content}</DisconnectedOverlay>;
  }

  return content;
};

export default EnemyHand;
