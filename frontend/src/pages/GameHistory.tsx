import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Avatar from "@mui/material/Avatar";
import { green } from "@mui/material/colors";
import type { ChipProps } from "@mui/material";

interface Players {
  playerName: string;
  playerId: string;
}

interface Game {
  id: string;
  gameId: string;
  playerId: string;
  players: Players[];
  winnerId: string;
  date: Date;
}

interface PlayerChipProps extends ChipProps {
  ownerState: {
    isWinner: boolean;
  };
}

const StyledHeader = styled(Paper)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(4),
  textAlign: "center",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  marginBottom: theme.spacing(4),
  borderRadius: theme.spacing(2),
}));

const BackButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.2, 3),
  fontSize: "1rem",
  fontWeight: "bold",
  borderRadius: theme.spacing(3),
  textTransform: "none",
  background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  color: "white",
  border: "none",
  boxShadow: "0 2px 8px 0 rgba(255, 105, 135, .12)",
  transition: "background 0.2s, box-shadow 0.25s",
  "&:hover": {
    background: "linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)",
    boxShadow: "0 8px 24px 0 rgba(0, 0, 0, .1)",
  },
}));

const GameCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 12px 0 rgba(0, 0, 0, .1)",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 8px 24px 0 rgba(0, 0, 0, .15)",
    transform: "translateY(-2px)",
  },
}));

const WinnerChip = styled(Chip)(() => ({
  background: "linear-gradient(45deg, #4CAF50 30%, #45a049 90%)",
  color: "white",
  fontWeight: "bold",
}));

const LoserChip = styled(Chip)(() => ({
  background: "linear-gradient(45deg, #f44336 30%, #d32f2f 90%)",
  color: "white",
  fontWeight: "bold",
}));

const PlayerChip = styled(Chip)<PlayerChipProps>(({ theme, ownerState }) => ({
  margin: theme.spacing(0.5),
  fontWeight: 500,
  // Custom styling for the winner
  ...(ownerState.isWinner && {
    backgroundColor: green[500],
    color: "white",
    "& .MuiChip-avatar": {
      backgroundColor: green[700],
      color: "white !important",
      fontWeight: "bold",
    },
  }),
}));

const GameHistory: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useUserContext();

  useEffect(() => {
    const fetchGameHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:3000/games", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data.data.games);
          setGames(data.data.games);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Erro ao carregar histórico de jogos");
        }
      } catch (err) {
        console.error("Error fetching game history:", err);
        setError("Erro de conexão. Verifique sua internet e tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchGameHistory();
  }, []);

  const handleBackToLobby = () => {
    navigate("/lobby");
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getWinnerName = (game: Game) => {
    const winner = game.players.find(
      (player) => player.playerId === game.winnerId
    );
    return winner ? winner.playerName : "Desconhecido";
  };

  const isUserWinner = (game: Game) => {
    return user && game.winnerId === user.id;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, position: "relative" }}>
      {/* Header */}
      <StyledHeader elevation={6} sx={{ position: "relative" }}>
        <Box
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            zIndex: 2,
          }}
        >
          <BackButton startIcon={<ArrowBackIcon />} onClick={handleBackToLobby}>
            Voltar
          </BackButton>
        </Box>

        <Box sx={{ height: { xs: 48, md: 0 } }} />

        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Histórico de Jogos
        </Typography>
        <Typography
          variant="h5"
          sx={{
            opacity: 0.9,
            textAlign: "center",
          }}
        >
          Veja todas as suas partidas anteriores
        </Typography>
      </StyledHeader>

      {/* Content */}
      <Box>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={60} />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && games.length === 0 && (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nenhum jogo encontrado
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Você ainda não jogou nenhuma partida. Que tal começar uma nova?
            </Typography>
          </Paper>
        )}

        {!loading && !error && games.length > 0 && (
          <Grid container spacing={3}>
            {games.map((game) => (
              <Grid size={{ xs: 12, md: 6 }} key={game.id}>
                <GameCard>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        mb: 2,
                        minHeight: 32,
                      }}
                    >
                      {isUserWinner(game) ? (
                        <WinnerChip
                          icon={<EmojiEventsIcon />}
                          label="Vitória"
                          size="small"
                        />
                      ) : (
                        <LoserChip label="Derrota" size="small" />
                      )}
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <EmojiEventsIcon sx={{ mr: 1, fontSize: 16 }} />
                        Vencedor:{" "}
                        <strong style={{ marginLeft: 4 }}>
                          {getWinnerName(game)}
                        </strong>
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <CalendarTodayIcon sx={{ mr: 1, fontSize: 16 }} />
                        {formatDate(game.date)}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <PersonIcon sx={{ mr: 1, fontSize: 16 }} />
                        Jogadores:
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {game.players.map((player, index) => (
                          <PlayerChip
                            key={index}
                            avatar={
                              <Avatar>{player.playerName.charAt(0)}</Avatar>
                            }
                            label={player.playerName}
                            size="small"
                            ownerState={{
                              isWinner: player.playerId === game.winnerId,
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                </GameCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default GameHistory;
