import { randomUUID } from "crypto";
import { Room } from "../interfaces/index";

const rooms: Map<string, Room> = new Map();

const createRoom = async (
  roomName: string,
  ownerId: string,
  ownerName: string
): Promise<{ roomId: string } | string> => {
  try {
    for (const room of rooms.values()) {
      if (room.roomName === roomName && room.status !== "FINISHED") {
        return "Já existe uma sala ativa com este nome";
      }
    }

    for (const room of rooms.values()) {
      if (room.ownerId === ownerId && room.status !== "FINISHED") {
        return "Você já criou uma sala ativa.";
      }
    }

    const roomId = randomUUID();

    const room: Room = {
      id: roomId,
      ownerId,
      roomName,
      canStart: false,
      status: "WAITING",
      additionalState: null,
      players: [
        {
          id: ownerId,
          name: ownerName,
          disconnected: false,
        },
      ],
    };

    rooms.set(roomId, room);

    return { roomId };
  } catch (error) {
    throw error;
  }
};

export { createRoom, rooms };
