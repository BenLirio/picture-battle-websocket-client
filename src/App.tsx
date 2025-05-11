import { useState } from "react";
import MessageInput from "./components/MessageInput";
import MessageList from "./components/MessageList";
import GameList from "./components/GameList";
import PlayerInfo from "./components/PlayerInfo";
import { useWebSocket } from "./socket";

function App() {
  const [input, setInput] = useState("");
  const { messages, games, playerId, playerToken, sendMessage } =
    useWebSocket();

  const handleSendMessage = () => {
    sendMessage(JSON.stringify({ action: "echo", data: input }));
    setInput("");
  };

  const handleCreateGame = () => {
    sendMessage(JSON.stringify({ action: "createGame", data: {} }));
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
        onSendMessage={handleSendMessage}
        onCreateGame={handleCreateGame}
      />
      <MessageList messages={messages} />
      <GameList games={games} onGameClick={handleGameClick} />
      <PlayerInfo playerId={playerId} playerToken={playerToken} />
    </div>
  );
}

export default App;
