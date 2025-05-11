import { useState, useEffect, useRef } from "react";

const WS_URL = import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:3001";

interface GameIdsMessage {
  type: "game_ids";
  data: {
    gameIds: string[];
  };
}

interface GameCreatedMessage {
  type: "game_created";
  gameId: string;
}

interface SetPlayerIdMessage {
  type: "set_player_id";
  data: {
    playerId: string;
  };
}

interface SetPlayerMessage {
  type: "set_player";
  data: {
    playerId: string;
    token: string;
  };
}

interface GameNoLongerAvailableMessage {
  type: "game_no_longer_available";
  gameId: string;
}

interface SetGameMessage {
  type: "set_game";
  data: {
    game: {
      id: string;
      playerIds: string[];
      state: "WAITING_FOR_PLAYERS" | "SELECTING_CHARACTERS"; // Using literal types for simplicity here, can use zod schema later
      settings: {
        maxPlayers: number;
      };
    };
  };
}

type WebSocketMessage =
  | GameIdsMessage
  | GameCreatedMessage
  | SetPlayerIdMessage
  | SetPlayerMessage
  | GameNoLongerAvailableMessage
  | SetGameMessage;

export const useWebSocket = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [games, setGames] = useState<string[]>([]);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerToken, setPlayerToken] = useState<string | null>(null);
  const [currentGame, setCurrentGame] = useState<
    SetGameMessage["data"]["game"] | null
  >(null);
  const wsRef = useRef<WebSocket | null>(null);
  const didOpenRef = useRef(false);

  useEffect(() => {
    const socket = new WebSocket(WS_URL);
    wsRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected, readyState:", socket.readyState);
      didOpenRef.current = true;
      setMessages((msgs) => [...msgs, "Connected to websocket server"]);
      socket.send(JSON.stringify({ action: "init", data: {} }));
    };

    socket.onmessage = (event) => {
      console.log("Received message:", event.data);
      try {
        const msg: WebSocketMessage = JSON.parse(event.data);
        if (
          msg.type === "game_ids" &&
          msg.data &&
          Array.isArray(msg.data.gameIds)
        ) {
          setGames((prevGames) => {
            const newGames = msg.data.gameIds.filter(
              (id: unknown): id is string =>
                typeof id === "string" && !prevGames.includes(id)
            );
            return [...prevGames, ...newGames];
          });
        } else if (msg.type === "game_created") {
          setGames((prevGames) => {
            if (!prevGames.includes(msg.gameId)) {
              return [...prevGames, msg.gameId];
            }
            return prevGames;
          });
        } else if (msg.type === "game_no_longer_available") {
          setGames((prevGames) =>
            prevGames.filter((gameId) => gameId !== msg.gameId)
          );
        } else if (msg.type === "set_player_id") {
          setPlayerId(msg.data.playerId);
        } else if (msg.type === "set_player") {
          setPlayerId(msg.data.playerId);
          setPlayerToken(msg.data.token);
        } else if (msg.type === "set_game") {
          setCurrentGame(msg.data.game);
        } else {
          setMessages((msgs) => [...msgs, event.data]);
        }
      } catch (e) {
        console.error("Failed to parse message or handle event:", e);
        // If JSON parsing fails, just add raw message
        setMessages((msgs) => [...msgs, event.data]);
      }
    };

    socket.onclose = (event) => {
      console.log(
        `WebSocket disconnected, code: ${event.code}, reason: ${event.reason}, wasClean: ${event.wasClean}`
      );
      if (didOpenRef.current) {
        setMessages((msgs) => [
          ...msgs,
          `Disconnected from websocket server (code: ${event.code}, reason: ${event.reason})`,
        ]);
      }
    };

    socket.onerror = (event) => {
      console.error("WebSocket error event:", event);
      if (didOpenRef.current) {
        setMessages((msgs) => [...msgs, "WebSocket error occurred"]);
      }
    };

    return () => {
      console.log("Closing WebSocket connection");
      socket.close();
    };
  }, []);

  const sendMessage = (message: string) => {
    if (wsRef.current) {
      console.log(
        "WebSocket readyState before send:",
        wsRef.current.readyState
      );
    }
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(message);
    } else {
      console.warn(
        "Attempted to send message but WebSocket is not connected. readyState:",
        wsRef.current ? wsRef.current.readyState : "null"
      );
      setMessages((msgs) => [...msgs, "WebSocket is not connected"]);
    }
  };

  return {
    messages,
    games,
    playerId,
    playerToken,
    currentGame,
    sendMessage,
  };
};
