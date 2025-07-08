import React from "react";
import { Box, Snackbar, Alert } from "@mui/material";
import { useParams } from "react-router-dom";
import RoomCodeDisplay from "../components/RoomCodeDisplay";
import UserHand from "../components/UserHand";
import EnemyHand from "../components/EnemyHand";
import GameCenter from "../components/GameCenter";
import GameInformations from "../components/GameInformations";
import ColorChoiceModal from "../components/ColorChoiceModal";
import { useWebSocketContext } from "../contexts/WebSocketContext";
import { useUserContext } from "../contexts/UserContext";
import { ReadyState } from "react-use-websocket";
import { useNavigate } from "react-router-dom";
import Winner from "../components/Winner";

interface Card {
  color: string;
  value: string;
  chosenColor?: string;
}

interface Player {
  id: string;
  name: string;
  cardCount?: number;
  alreadyBought?: boolean;
  isTheirTurn?: boolean;
  disconnected?: boolean;
  yelledUno?: boolean;
  hand?: Card[];
}

function getPlayerOrder(playersArray: Player[], startPlayerId: string) {
  const arrayOrder = [];
  const beforeOrder: number[] = [];
  const afterOrder: number[] = [];
  const startIndex = playersArray.findIndex(
    (player) => startPlayerId === player.id
  );
  if (startIndex === -1) return []; // Handle case where user is not in the players array yet
  arrayOrder.push(startIndex);
  playersArray.forEach((_, index) => {
    if (index === startIndex) {
      return;
    }
    if (index <= startIndex) {
      beforeOrder.push(index);
    } else {
      afterOrder.push(index);
    }
  });
  arrayOrder.push(...afterOrder);
  arrayOrder.push(...beforeOrder);
  return arrayOrder;
}

const Room: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [openColorChoiceModal, setOpenColorChoiceModal] =
    React.useState<boolean>(false);
  // Get both connect and disconnect from the context
  const { sendMessage, lastMessage, readyState, connect, disconnect } =
    useWebSocketContext();
  const { user } = useUserContext();
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [playersOrder, setPlayersOrder] = React.useState<number[]>([]);
  const [owner, setOwner] = React.useState<boolean>(false);
  const [currentCard, setCurrentCard] = React.useState<Card>();
  const [currentPlayerId, setCurrentPlayerId] = React.useState<string>("");
  const [playerHand, setPlayerHand] = React.useState<Card[]>([]);
  const [winnerName, setWinnerName] = React.useState<string>("");
  const [showWinner, setShowWinner] = React.useState<boolean>(false);
  const [roomStatus, setRoomStatus] = React.useState<string>("");
  const [gameDirection, setGameDirection] = React.useState<string>("");
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [showError, setShowError] = React.useState<boolean>(false);
  const [endTime, setEndTime] = React.useState<number>(0);
  const [startTime, setStartTime] = React.useState<number>(0);
  const navigate = useNavigate();

  const errorAndGoBack = () => {
    setShowError(true);
    setErrorMessage("Ocorreu um erro interno no servidor.");
    setTimeout(() => {
      navigate(`/lobby`);
    }, 3000);
  };
  // Start WebSocket connection when component mounts and disconnect when it unmounts
  React.useEffect(() => {
    console.log("Room component mounted. Connecting to WebSocket...");
    if (code) {
      connect(code, errorAndGoBack);
    }

    // Return a cleanup function to be called when the component unmounts
    return () => {
      console.log("Room component unmounted. Disconnecting from WebSocket...");
      disconnect();
    };
  }, []); // Dependencies for the effect

  // Console log user information when component mounts or user changes
  React.useEffect(() => {
    console.log("User information in Room:", {
      userId: user.id,
      userName: user.name,
      roomCode: code,
    });
  }, [user, code]);

  // Handle incoming messages specific to the room
  React.useEffect(() => {
    if (lastMessage !== null) {
      try {
        const data = JSON.parse(lastMessage.data);
        // console.log(data);

        switch (data.type) {
          case "DELETE_ROOM":
            setErrorMessage("Sala foi excluida!");
            setShowError(true);
            setTimeout(() => {
              navigate(`/lobby`);
            }, 3000);
            break;
          case "START_GAME":
            console.log("Game started:", data);
            // Handle game start - update UI to show game state
            break;
          case "UPDATE_ROOM":
            console.log("Room updated:", data.payload);
            setRoomStatus(data.payload.status);
            setPlayers(data.payload.players);
            if (user.id) {
              setOwner(data.payload.ownerId === user.id);
              setPlayersOrder(getPlayerOrder(data.payload.players, user.id));
            }
            setCurrentPlayerId(data.payload.currentPlayerId);
            setCurrentCard(data.payload.currentCard);
            setGameDirection(data.payload.gameDirection);
            if (data.payload.playerHand) {
              setPlayerHand(data.payload.playerHand);
            }
            if (
              data.payload.additionalState === "CHOOSING_COLOR" &&
              data.payload.currentPlayerId === user.id
            ) {
              setOpenColorChoiceModal(true);
            }
            if (
              data.payload.additionalState != "CHOOSING_COLOR" &&
              openColorChoiceModal
            ) {
              setOpenColorChoiceModal(false);
            }
            if (data.payload.winner) {
              setWinnerName(data.payload.winner);
              setShowWinner(true);
              setPlayerHand([]);
            }
            if (data.payload.entTimestamp) {
              setEndTime(data.payload.entTimestamp);
            }
            if (data.payload.startTimestamp) {
              setStartTime(data.payload.startTimestamp);
            }

            break;
          case "ERROR":
            console.error("Server error:", data.payload.message);
            setErrorMessage(data.payload.message);
            setShowError(true);
            if (data.payload.action === "LEAVE_ROOM") {
              setTimeout(() => {
                navigate(`/lobby`);
              }, 3000);
            }
            break;
          default:
            console.log("Unknown message type:", data.type, data);
            break;
        }
      } catch (error) {
        console.error("Error parsing WebSocket message in Room:", error);
      }
    }
  }, [lastMessage, user.id]);

  const handleCloseError = () => {
    setShowError(false);
    setErrorMessage("");
  };

  const handleSkipTurn = () => {
    if (readyState === ReadyState.OPEN) {
      sendMessage(JSON.stringify({ type: "SKIP_ROUND", roomCode: code }));
    }
  };

  const handleBuyCard = () => {
    if (readyState === ReadyState.OPEN) {
      sendMessage(JSON.stringify({ type: "BUY_CARD", roomCode: code }));
    }
  };

  return (
    <>
      {roomStatus !== "IN_GAME" && (
        <>
          <Box
            sx={{
              position: "fixed",
              top: 16,
              right: 16,
              zIndex: 1000,
            }}
          >
            {code && <RoomCodeDisplay roomCode={code} owner={owner} />}
          </Box>
        </>
      )}

      {playersOrder.map((playerIndex, position) => {
        const player = players[playerIndex];
        if (!player) return null; // Defensive check
        if (position === 0) {
          return (
            <UserHand
              key={player.id}
              name={player.name || ""}
              cardCount={player.cardCount || 0}
              yelledUno={player.yelledUno || false}
              hand={playerHand}
              playerId={player.id || ""}
              currentPlayerId={currentPlayerId}
            />
          );
        }
        return (
          <EnemyHand
            key={player.id}
            name={player.name || ""}
            cardCount={player.cardCount || 0}
            yelledUno={player.yelledUno || false}
            disconnected={player.disconnected || false}
            position={position + 1}
            playerId={player.id || ""}
            currentPlayerId={currentPlayerId}
          />
        );
      })}
      {currentCard && (
        <>
          <GameCenter
            lastPlayedCard={currentCard}
            onSkipTurn={handleSkipTurn}
            onSelectCardBack={handleBuyCard}
          />
          <GameInformations
            gameDirection={gameDirection}
            gameColor={currentCard}
            startTime={startTime}
            endTime={endTime}
          />
          <ColorChoiceModal
            open={openColorChoiceModal}
            hand={playerHand}
            onColorSelect={(color) => {
              if (readyState === ReadyState.OPEN) {
                sendMessage(
                  JSON.stringify({
                    type: "CHOOSE_COLOR",
                    payload: {
                      color,
                    },
                  })
                );
              }
              setOpenColorChoiceModal(!openColorChoiceModal);
              console.log(color);
            }}
          />
        </>
      )}

      <Winner
        winnerName={winnerName}
        open={showWinner}
        onClose={() => setShowWinner(false)}
      />

      <Snackbar
        open={showError}
        autoHideDuration={3000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Room;
