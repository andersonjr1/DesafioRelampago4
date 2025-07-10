import React from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
import { useWebSocketContext } from "../contexts/WebSocketContext";

const RoomCodeContainer = styled(Box)(({ theme }) => ({
  // Fundo sutilmente acinzentado para destacar o container do fundo branco da página
  background: "#f7f9fa",
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  margin: theme.spacing(2, 0),
  // Borda sólida e escura para uma definição clara
  border: `2px solid ${theme.palette.grey[300]}`,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(2),
}));

const DeleteButton = styled(Button)(({ theme }) => ({
  // Cor do texto do botão de exclusão usando a paleta de erro do tema
  color: theme.palette.error.main,
  // Cor da borda correspondente
  borderColor: theme.palette.error.main,
  "&:hover": {
    // Escurece a borda no hover
    borderColor: theme.palette.error.dark,
    // Adiciona um fundo sutil com a cor de erro no hover
    backgroundColor: "rgba(211, 47, 47, 0.04)", // Cor de erro do MUI com baixa opacidade
  },
}));

const CodeText = styled(Typography)(({ theme }) => ({
  // Cor de texto escura para legibilidade
  color: theme.palette.text.primary,
  fontWeight: "bold",
  letterSpacing: "4px",
  fontFamily: "monospace",
  fontSize: "1.7rem",
  cursor: "pointer",
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1),
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    transform: "scale(1.02)",
  },
  "&:active": {
    transform: "scale(0.98)",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.5rem",
    letterSpacing: "2px",
  },
}));

const StartButton = styled(Button)(({ theme }) => ({
  color: theme.palette.success.main,
  borderColor: theme.palette.success.main,
  "&:hover": {
    borderColor: theme.palette.success.dark,
    backgroundColor: "rgba(76, 175, 80, 0.04)",
  },
}));

const DisconnectButton = styled(Button)(({ theme }) => ({
  color: theme.palette.warning.main,
  borderColor: theme.palette.warning.main,
  "&:hover": {
    borderColor: theme.palette.warning.dark,
    backgroundColor: "rgba(255, 152, 0, 0.04)",
  },
}));

interface RoomCodeDisplayProps {
  roomCode: string;
  owner: boolean;
}

const RoomCodeDisplay: React.FC<RoomCodeDisplayProps> = ({
  roomCode,
  owner,
}) => {
  const navigate = useNavigate();
  const { sendMessage } = useWebSocketContext();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [copySuccess, setCopySuccess] = React.useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Falha ao copiar código:", err);
    }
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleStart = () => {
    // Send START_GAME WebSocket message
    sendMessage(JSON.stringify({ type: "START_GAME" }));
  };

  const handleDisconnect = () => {
    // Send DISCONNECT WebSocket message
    sendMessage(JSON.stringify({ type: "DISCONNECT_VOLUNTARY" }));
    navigate("/lobby");
  };

  const confirmDeleteRoom = () => {
    // Send DELETE_ROOM WebSocket message
    sendMessage(JSON.stringify({ type: "DELETE_ROOM" }));

    setDeleteDialogOpen(false);
    navigate("/lobby");
  };

  const cancelDeleteRoom = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <RoomCodeContainer>
        <CodeText onClick={handleCopyCode} title="Clique para copiar o código">
          {copySuccess ? "COPIADO!" : roomCode.toUpperCase()}
        </CodeText>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {owner && (
            <StartButton
              variant="outlined"
              size="small"
              startIcon={<PlayArrowIcon />}
              onClick={handleStart}
            >
              Iniciar Jogo
            </StartButton>
          )}

          {!owner && (
            <DisconnectButton
              variant="outlined"
              size="small"
              startIcon={<ExitToAppIcon />}
              onClick={handleDisconnect}
            >
              Desconectar
            </DisconnectButton>
          )}

          {owner && (
            <DeleteButton
              variant="outlined"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
            >
              Deletar Sala
            </DeleteButton>
          )}
        </Box>
      </RoomCodeContainer>

      {/* Dialog de confirmação para deletar sala */}
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDeleteRoom}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Deletar Sala?</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Tem certeza que deseja deletar a sala{" "}
            <strong>{roomCode.toUpperCase()}</strong>? Esta ação não pode ser
            desfeita e todos os jogadores serão removidos da sala.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDeleteRoom} color="primary">
            Cancelar
          </Button>
          <Button onClick={confirmDeleteRoom} color="error" variant="contained">
            Deletar Sala
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RoomCodeDisplay;
