import MessageInput from "./components/MessageInput";
import GameList from "./components/GameList";
import PlayerInfo from "./components/PlayerInfo";
import GameDetails from "./components/GameDetails";
import { useWebSocket } from "./socket";

function App() {
  const { games, playerId, playerToken, currentGame, sendMessage } =
    useWebSocket();

  const handleCreateGame = () => {
    sendMessage(JSON.stringify({ action: "createGame", data: {} }));
  };

  const handleGameClick = (gameId: string) => {
    console.log("Clicked game:", gameId);
    sendMessage(
      JSON.stringify({
        action: "joinGame",
        data: { gameId, playerId, playerToken },
      })
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>WebSocket Echo Client</h1>
      {currentGame && playerId && playerToken ? (
        <GameDetails
          game={currentGame}
          playerId={playerId}
          playerToken={playerToken}
        />
      ) : (
        <>
          <MessageInput onCreateGame={handleCreateGame} />
          <GameList games={games} onGameClick={handleGameClick} />
        </>
      )}
      <PlayerInfo playerId={playerId} playerToken={playerToken} />
    </div>
  );
}

export default App;
