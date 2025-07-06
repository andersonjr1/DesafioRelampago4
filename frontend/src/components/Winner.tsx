import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { EmojiEvents, Celebration } from "@mui/icons-material";

// --- Interfaces ---
interface WinnerProps {
  open: boolean;
  winnerName: string;
  onClose: () => void;
}

// --- Styled Components ---
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    minWidth: "400px",
    maxWidth: "500px",
    textAlign: "center",
  },
}));

const WinnerContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(3),
  padding: theme.spacing(2),
}));

const TrophyIcon = styled(EmojiEvents)(() => ({
  fontSize: "4rem",
  color: "#ffd700", // Gold color
  filter: "drop-shadow(0 4px 8px rgba(255, 215, 0, 0.3))",
}));

const CelebrationIcon = styled(Celebration)(({ theme }) => ({
  fontSize: "2rem",
  color: theme.palette.primary.main,
  animation: "bounce 2s infinite",
  "@keyframes bounce": {
    "0%, 20%, 50%, 80%, 100%": {
      transform: "translateY(0)",
    },
    "40%": {
      transform: "translateY(-10px)",
    },
    "60%": {
      transform: "translateY(-5px)",
    },
  },
}));

// REMOVIDO WinnerTitle POIS NÃO ESTÁ SENDO USADO

const WinnerName = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  fontSize: "1.5rem",
  color: "#000",
  textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(1),
}));

const CloseButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1, 3),
  fontWeight: "bold",
  textTransform: "none",
  fontSize: "1rem",
}));

// --- Componente Principal ---
const Winner: React.FC<WinnerProps> = ({ open, winnerName, onClose }) => {
  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      aria-labelledby="winner-dialog-title"
      disableEscapeKeyDown={false}
    >
      <DialogTitle id="winner-dialog-title">
        <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
          <CelebrationIcon />
          <Typography variant="h5" component="div" fontWeight="bold">
            Jogo Finalizado!
          </Typography>
          <CelebrationIcon />
        </Box>
      </DialogTitle>

      <DialogContent>
        <WinnerContainer>
          <TrophyIcon />
          <WinnerName>{winnerName}</WinnerName>
          <Typography variant="h6" color="text.secondary">
            é o vencedor!
          </Typography>
        </WinnerContainer>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <CloseButton
          onClick={onClose}
          variant="contained"
          color="primary"
          size="large"
        >
          Fechar
        </CloseButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default Winner;
