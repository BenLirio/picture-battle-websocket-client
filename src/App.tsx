import { useState, useEffect, useRef } from "react";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
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
    };

    socket.onmessage = (event) => {
      console.log("Received message:", event.data);
      setMessages((msgs) => [...msgs, event.data]);
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
    </div>
  );
}

export default App;
