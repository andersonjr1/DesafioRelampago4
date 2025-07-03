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
  const [openColorChoiceModal, setOpenColorChoiceModal] = React.useState(true);
  const { sendMessage, lastMessage, readyState } = useWebSocketContext();
  const { user } = useUserContext();
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [playersOrder, setPlayersOrder] = React.useState<number[]>([]);
  const [currentPlayerId, setCurrentPlayerId] = React.useState<string>("");
  const [owner, setOwner] = React.useState<boolean>(false);

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
          case "JOIN_ROOM":
            console.log("Player joined room:", data);
            // Handle player joining room
            break;
          case "DELETE_ROOM":
            console.log("Room deleted:", data);
            // Handle room deletion - maybe redirect to lobby
            break;
          case "START_GAME":
            console.log("Game started:", data);
            // Handle game start - update UI to show game state
            break;
          case "UPDATE_HAND":
            console.log("Hand updated:", data);
            // Handle player hand updates
            break;
          case "UPDATE_ROOM":
            setPlayers(data.room.players);
            setPlayersOrder(getPlayerOrder(data.room.players, user.id));
            break;
          case "UPDATE_PLAYER":
            console.log("Player updated:", data);
            // Handle individual player updates
            break;
          case "ERROR":
            console.error("Server error:", data);
            // Handle server errors - show error message to user
            break;
          case "GAME_STATE_UPDATE":
            console.log("Game state updated:", data);
            // Handle game state updates
            break;
          case "PLAYER_ACTION":
            console.log("Player action:", data);
            // Handle player actions
            break;
          case "CARD_PLAYED":
            console.log("Card played:", data);
            // Handle card played events
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

  // const handleSkipTurn = () => {
  //   if (readyState === ReadyState.OPEN) {
  //     sendMessage(JSON.stringify({ type: "SKIP_TURN", roomCode: code }));
  //   }
  // };
  console.log(playersOrder);
  return (
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
      {playersOrder.map((playerIndex, position) => {
        const player = players[playerIndex];
        if (position == 0) {
          return (
            <UserHand
              name={player.name || ""}
              cardCount={player.cardCount || 0}
              yelledUno={player.yelledUno || false}
              hand={player.hand || []}
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

      {/*
      <GameCenter
        lastPlayedCard={{ color: "red", value: "10" }}
        onSkipTurn={handleSkipTurn}
      />
      <GameInformations
        gameDirection="clockwise"
        gameColor={{
          color: "red",
          value: "10",
        }}
      />

      <ColorChoiceModal
        open={openColorChoiceModal}
        hand={handUser}
        onColorSelect={(color) => {
          setOpenColorChoiceModal(!openColorChoiceModal);
          console.log(color);
        }}
      /> */}
    </>
  );
};

export default Room;
