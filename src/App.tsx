import { useState, useEffect, useRef } from "react";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [games, setGames] = useState<string[]>([]);
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

  return (
    <div style={{ padding: 20 }}>
      <h1>WebSocket Echo Client</h1>
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          style={{ width: 300, marginRight: 10 }}
        />
        <button onClick={sendMessage}>Send</button>
        <button onClick={sendCreateGame} style={{ marginLeft: 10 }}>
          Create Game
        </button>
      </div>
      <div
        style={{
          marginTop: 20,
          maxHeight: 300,
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: 10,
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: 5 }}>
            {msg}
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 20,
          maxHeight: 200,
          overflowY: "auto",
          border: "1px solid #666",
          padding: 10,
        }}
      >
        <h2>Games</h2>
        {games.length === 0 ? (
          <div>No games available</div>
        ) : (
          <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
            {games.map((gameId) => (
              <li
                key={gameId}
                style={{
                  cursor: "pointer",
                  padding: "5px 10px",
                  borderBottom: "1px solid #ccc",
                  userSelect: "none",
                }}
                onClick={() => {
                  console.log("Clicked game:", gameId);
                  // Placeholder for future click handling logic
                }}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    console.log("Activated game via keyboard:", gameId);
                    // Placeholder for future keyboard activation logic
                  }
                }}
                role="button"
                aria-pressed="false"
              >
                {gameId}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
