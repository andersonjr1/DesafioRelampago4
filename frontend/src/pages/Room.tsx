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

const handUser = [
  {
    color: "red",
    value: "1",
  },
  {
    color: "red",
    value: "2",
  },
  {
    color: "red",
    value: "3",
  },
  {
    color: "red",
    value: "4",
  },
  {
    color: "red",
    value: "5",
  },
  {
    color: "red",
    value: "6",
  },
  {
    color: "red",
    value: "7",
  },
  {
    color: "red",
    value: "8",
  },
  {
    color: "red",
    value: "9",
  },
];

const Room: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [openColorChoiceModal, setOpenColorChoiceModal] = React.useState(true);
  const { sendMessage, lastMessage, readyState } = useWebSocketContext();
  const { user } = useUserContext();

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
            console.log("Room created:", data);
            // Handle room creation response
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
            console.log("Room updated:", data);
            // Handle room state updates (players, settings, etc.)
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

  const handleSkipTurn = () => {
    if (readyState === ReadyState.OPEN) {
      sendMessage(JSON.stringify({ type: "SKIP_TURN", roomCode: code }));
    }
  };

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
        {code && <RoomCodeDisplay roomCode={code} />}
      </Box>
      <EnemyHand
        name="Jogador 2"
        cardCount={7}
        yelledUno={false}
        disconnected={true}
        position={2}
        playerId="2"
        currentPlayerId="3"
      />

      <EnemyHand
        name="Jogador 3"
        cardCount={1}
        yelledUno={false}
        disconnected={false}
        position={3}
        playerId="3"
        currentPlayerId="2"
      />

      <EnemyHand
        name="Jogador 4"
        cardCount={3}
        yelledUno={false}
        disconnected={false}
        position={4}
        playerId="4"
        currentPlayerId="2"
      />
      <UserHand
        name="André"
        cardCount={1}
        yelledUno={false}
        hand={handUser}
        playerId="1"
        currentPlayerId="2"
      />
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
      />
    </>
  );
};

export default Room;
