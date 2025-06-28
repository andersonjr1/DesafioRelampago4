import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

// --- Componentes Estilizados (Styled Components) ---

// Container principal da carta.
// Exatamente o mesmo estilo da frente para manter a consistência.
const CardContainer = styled(Box)(({ theme }) => ({
  width: 180,
  height: 270,
  backgroundColor: "#2b2b2b", // Preto padrão do verso
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(1.5),
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
  color: "white",
}));

// A elipse vermelha central que contém o logo.
const CenterOval = styled(Box)(() => ({
  width: "85%",
  height: "50%",
  backgroundColor: "#ff5555", // Vermelho clássico do UNO
  borderRadius: "50%", // Transforma o Box em uma elipse/círculo
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transform: "rotate(-25deg)", // Rotação característica do logo
}));

// O texto "UNO" estilizado.
const UnoLogoText = styled(Typography)(() => ({
  fontFamily: '"Arial Black", "Impact", sans-serif',
  fontWeight: 900,
  fontSize: "4.5rem",
  color: "white",
  // O skew (inclinação) dá o efeito itálico agressivo do logo original.
  transform: "skewX(-10deg)",
  // Sombra sutil para destacar o texto da elipse vermelha.
  textShadow: "3px 3px 5px rgba(0,0,0,0.3)",
}));

// --- Componente Principal ---

interface UnoCardBackProps {
  onSelect?: () => void;
}

const UnoCardBack: React.FC<UnoCardBackProps> = ({ onSelect }) => {
  return (
    <CardContainer onClick={onSelect} sx={{ cursor: onSelect ? 'pointer' : 'default' }}>
      <CenterOval>
        <UnoLogoText>UNO</UnoLogoText>
      </CenterOval>
    </CardContainer>
  );
};

export default UnoCardBack;
