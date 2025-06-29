import React from "react";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import RoomCodeDisplay from "../components/RoomCodeDisplay";
import UserHand from "../components/UserHand";
import EnemyHand from "../components/EnemyHand";
import GameCenter from "../components/GameCenter";
import GameInformations from "../components/GameInformations";
import ColorChoiceModal from "../components/ColorChoiceModal";

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
        disconnected={false}
        position={2}
      />

      <EnemyHand
        name="Jogador 3"
        cardCount={1}
        yelledUno={false}
        disconnected={false}
        position={3}
      />

      <EnemyHand
        name="Jogador 4"
        cardCount={3}
        yelledUno={false}
        disconnected={false}
        position={4}
      />
      <UserHand name="André" cardCount={1} yelledUno={false} hand={handUser} />
      <GameCenter lastPlayedCard={{ color: "red", value: "10" }} />
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
