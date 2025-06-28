import React from "react";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import RoomCodeDisplay from "../components/RoomCodeDisplay";
import UserHand from "../components/UserHand";
import EnemyHand from "../components/EnemyHand";

const Room: React.FC = () => {
  const { code } = useParams<{ code: string }>();

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
        cardCount={5}
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
      <UserHand
        name="André"
        cardCount={7}
        yelledUno={false}
        hand={[
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
          {
            color: "red",
            value: "10",
          },
          {
            color: "green",
            value: "1",
          },
        ]}
      />
    </>
  );
};

export default Room;
