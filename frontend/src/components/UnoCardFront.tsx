import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";

// --- Types ---
type UnoColor = "red" | "yellow" | "green" | "blue" | "black";
type UnoValue = string | number;

interface UnoCardProps {
  color: UnoColor;
  value: UnoValue;
  onSelect?: () => void; // Adiciona a propriedade opcional onSelect
}

interface CardContainerProps {
  cardColor: string;
}

interface CenterValueProps {
  cardColor: string;
}

// --- Mapa de Cores ---
// Mapeia o nome da cor para um código hexadecimal vibrante, similar ao do jogo real.
const colorMap: Record<UnoColor, string> = {
  red: "#ff5555",
  yellow: "#ffaa00",
  green: "#55aa55",
  blue: "#5555ff",
  black: "#2b2b2b", // Para as cartas coringa
};

// --- Componentes Estilizados (Styled Components) ---

// O container principal da carta.
// Define o formato, sombra, cor de fundo e posicionamento relativo.
const CardContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "cardColor",
})<CardContainerProps>(({ theme, cardColor }) => ({
  width: 120,
  height: 180,
  backgroundColor: cardColor,
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(1.5),
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
  color: "white",
}));

// O valor nos cantos superior esquerdo e inferior direito.
const CornerValue = styled(Typography)({
  fontWeight: "bold",
  fontSize: "1.2rem",
  fontFamily: '"Arial Black", Gadget, sans-serif',
  position: "absolute",
});

// O grande círculo branco no centro da carta.
const CenterOval = styled(Box)({
  width: "100%",
  height: "60%",
  backgroundColor: "white",
  borderRadius: "50%",
  transform: "rotate(-45deg)",
  position: "absolute",
});

// O conteúdo que fica sobre o círculo central (o valor grande).
const CenterValue = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "cardColor",
})<CenterValueProps>(({ cardColor }) => ({
  color: cardColor,
  fontWeight: "bold",
  fontSize: "3.5rem",
  fontFamily: '"Arial Black", Gadget, sans-serif',
  zIndex: 1, // Garante que o número fique sobre o círculo branco
  textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  lineHeight: 1,
}));

// Componente especial para exibir as 4 cores da carta Coringa.
const WildColorDisplay: React.FC = () => (
  <Grid container sx={{ width: "80%", height: "80%", zIndex: 1 }}>
    <Grid
      size={{ xs: 6 }}
      sx={{ backgroundColor: colorMap.red, borderTopLeftRadius: "100%" }}
    />
    <Grid
      size={{ xs: 6 }}
      sx={{ backgroundColor: colorMap.blue, borderTopRightRadius: "100%" }}
    />
    <Grid
      size={{ xs: 6 }}
      sx={{ backgroundColor: colorMap.yellow, borderBottomLeftRadius: "100%" }}
    />
    <Grid
      size={{ xs: 6 }}
      sx={{ backgroundColor: colorMap.green, borderBottomRightRadius: "100%" }}
    />
  </Grid>
);

// --- Componente Principal ---

const UnoCardFront: React.FC<UnoCardProps> = ({ color, value, onSelect }) => {
  // Define se a carta é uma carta Coringa (que tem o fundo preto).
  const isWild = color === "black";
  // Obtém a cor de fundo a partir do mapa de cores.
  const backgroundColor = colorMap[color] || colorMap.black;

  return (
    <CardContainer cardColor={backgroundColor} onClick={onSelect} sx={{ cursor: onSelect ? 'pointer' : 'default' }}>
      {/* Canto superior esquerdo */}
      <CornerValue sx={{ top: 8, left: 16 }}>{value}</CornerValue>

      {/* Elemento central da carta */}
      {!isWild && <CenterOval />}
      {isWild ? (
        <WildColorDisplay />
      ) : (
        <CenterValue cardColor={backgroundColor}>{value}</CenterValue>
      )}

      {/* Canto inferior direito (rotacionado) */}
      <CornerValue sx={{ bottom: 8, right: 16, transform: "rotate(180deg)" }}>
        {value}
      </CornerValue>
    </CardContainer>
  );
};

export default UnoCardFront;
