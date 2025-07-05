import React from "react";
import { Box } from "@mui/material";
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
  arrayOrder.push(startIndex);
  playersArray.forEach((_, index) => {
    if (index == startIndex) {
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
  const { sendMessage, lastMessage, readyState } = useWebSocketContext();
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
  console.log(openColorChoiceModal);

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

        switch (data.type) {
          case "CREATE_ROOM":
            setPlayers(data.room.players);
            setPlayersOrder(getPlayerOrder(data.room.players, user.id));
            setOwner(true);
            break;
          // case "JOIN_ROOM":
          //   console.log("Player joined room:", data);
          //   // Handle player joining room
          //   break;
          case "DELETE_ROOM":
            console.log("Room deleted:", data);
            // Handle room deletion - maybe redirect to lobby
            break;
          // case "START_GAME":
          //   console.log("Game started:", data);
          //   // Handle game start - update UI to show game state
          //   break;
          case "UPDATE_ROOM":
            console.log("Room updated:", data);
            setRoomStatus(data.room.status);
            setPlayers(data.room.players);
            setPlayersOrder(getPlayerOrder(data.room.players, user.id));
            setCurrentPlayerId(data.room.currentPlayerId);
            setCurrentCard(data.room.currentCard);
            setGameDirection(data.room.gameDirection);
            if (data.playerHand) {
              setPlayerHand(data.playerHand);
            }
            if (
              data.room.additionalState === "CHOOSING_COLOR" &&
              data.room.currentPlayerId === user.id
            ) {
              setOpenColorChoiceModal(true);
            }
            if (data.winner) {
              setWinnerName(data.room.name);
              setShowWinner(true);
            }
            break;
          case "ERROR":
            console.error("Server error:", data);
            // Handle server errors - show error message to user
            break;
          default:
            console.log("Unknown message type:", data.type, data);
            break;
        }
      } catch (error) {
        console.error("Error parsing WebSocket message in Room:", error);
      }
    }
  }, [lastMessage]);

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
  console.log(playersOrder);
  return (
    <>
      {roomStatus != "IN_GAME" && (
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
        if (position == 0) {
          return (
            <UserHand
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
          />
          <ColorChoiceModal
            open={openColorChoiceModal}
            hand={playerHand}
            onColorSelect={(color) => {
              if (readyState === ReadyState.OPEN) {
                sendMessage(
                  JSON.stringify({
                    type: "CHOOSE_COLOR",
                    color,
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
    </>
  );
};

export default Room;
