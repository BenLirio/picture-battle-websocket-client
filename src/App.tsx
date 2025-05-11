import { useState, useEffect, useRef } from "react";
import MessageInput from "./components/MessageInput";
import MessageList from "./components/MessageList";
import GameList from "./components/GameList";
import PlayerInfo from "./components/PlayerInfo";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [games, setGames] = useState<string[]>([]);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerToken, setPlayerToken] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const didOpenRef = useRef(false);

  useEffect(() => {
    const WS_URL = import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:3001";
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
        const msg = JSON.parse(event.data);
        if (
          msg.type === "game_ids" &&
          msg.data &&
          Array.isArray(msg.data.gameIds)
        ) {
          setGames((prevGames) => {
            const newGames = msg.data.gameIds.filter(
              (id: string) => !prevGames.includes(id)
            );
            return [...prevGames, ...newGames];
          });
        } else if (
          msg.type === "game_created" &&
          typeof msg.gameId === "string"
        ) {
          setGames((prevGames) => {
            if (!prevGames.includes(msg.gameId)) {
              return [...prevGames, msg.gameId];
            }
            return prevGames;
          });
        } else if (
          msg.type === "set_player_id" &&
          msg.data &&
          typeof msg.data.playerId === "string"
        ) {
          setPlayerId(msg.data.playerId);
        } else if (
          msg.type === "set_player" &&
          msg.data &&
          typeof msg.data.playerId === "string" &&
          typeof msg.data.token === "string"
        ) {
          setPlayerId(msg.data.playerId);
          setPlayerToken(msg.data.token);
        } else {
          setMessages((msgs) => [...msgs, event.data]);
        }
      } catch {
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

  const sendMessage = () => {
    if (wsRef.current) {
      console.log(
        "WebSocket readyState before send:",
        wsRef.current.readyState
      );
    }
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ action: "echo", data: input });
      wsRef.current.send(message);
      setMessages((msgs) => [...msgs, "Sent: " + input]);
      setInput("");
    } else {
      console.warn(
        "Attempted to send message but WebSocket is not connected. readyState:",
        wsRef.current ? wsRef.current.readyState : "null"
      );
      setMessages((msgs) => [...msgs, "WebSocket is not connected"]);
    }
  };

  const sendCreateGame = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ action: "createGame", data: {} });
      wsRef.current.send(message);
      setMessages((msgs) => [...msgs, "Sent: createGame"]);
    } else {
      console.warn(
        "Attempted to send createGame but WebSocket is not connected. readyState:",
        wsRef.current ? wsRef.current.readyState : "null"
      );
      setMessages((msgs) => [...msgs, "WebSocket is not connected"]);
    }
  };

  const handleGameClick = (gameId: string) => {
    console.log("Clicked game:", gameId);
    // Placeholder for future click handling logic
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>WebSocket Echo Client</h1>
      <MessageInput
        input={input}
        onInputChange={setInput}
        onSendMessage={sendMessage}
        onCreateGame={sendCreateGame}
      />
      <MessageList messages={messages} />
      <GameList games={games} onGameClick={handleGameClick} />
      <PlayerInfo playerId={playerId} playerToken={playerToken} />
    </div>
  );
}

export default App;
