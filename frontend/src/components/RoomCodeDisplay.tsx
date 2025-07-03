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
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";

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

const CodeText = styled(Typography)(({ theme }) => ({
  // Cor de texto escura para legibilidade
  color: theme.palette.text.primary,
  fontWeight: "bold",
  letterSpacing: "4px",
  fontFamily: "monospace",
  fontSize: "1.7rem",
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.5rem",
    letterSpacing: "2px",
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  // Cor do texto do botão usando a cor primária do tema (geralmente azul ou roxo)
  color: theme.palette.primary.main,
  // Cor da borda correspondente
  borderColor: theme.palette.primary.main,
  "&:hover": {
    // Escurece a borda no hover
    borderColor: theme.palette.primary.dark,
    // Adiciona um fundo sutil no hover para feedback
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
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
    // Logic to start the game
    console.log(`Starting game for room: ${roomCode}`);
    // Here you would send a WebSocket message to start the game
    // Example: sendMessage(JSON.stringify({ type: "START_GAME", roomCode }));
  };

  const handleDisconnect = () => {
    // Logic to disconnect from the room
    console.log(`Disconnecting from room: ${roomCode}`);
    // Here you would send a WebSocket message to leave the room
    // Example: sendMessage(JSON.stringify({ type: "LEAVE_ROOM", roomCode }));
    navigate("/lobby");
  };

  const confirmDeleteRoom = () => {
    // Aqui você implementaria a lógica real de deletar a sala
    // Por exemplo, fazer uma chamada para a API
    console.log(`Deletando sala com código: ${roomCode}`);

    // Simular deleção e redirecionar para o lobby
    setDeleteDialogOpen(false);
    navigate("/lobby");
  };

  const cancelDeleteRoom = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <RoomCodeContainer>
        <CodeText>{roomCode.toUpperCase()}</CodeText>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <ActionButton
            variant="outlined"
            size="small"
            startIcon={<ContentCopyIcon />}
            onClick={handleCopyCode}
          >
            {copySuccess ? "Copiado!" : "Copiar Código"}
          </ActionButton>

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
