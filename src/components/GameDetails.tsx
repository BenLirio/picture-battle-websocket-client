import React from "react";
import CharacterSelect from "./CharacterSelect";

interface GameDetailsProps {
  game: {
    id: string;
    playerIds: string[];
    state:
      | "WAITING_FOR_PLAYERS"
      | "SELECTING_CHARACTERS"
      | "GAME_LOOP"
      | "GAME_OVER";
    canAct: string[];
    settings: {
      maxPlayers: number;
    };
    characters: Array<{
      playerId: string;
      characterId: string;
    }>;
    messages: Array<{
      from: string;
      message: string;
    }>;
  } | null;
  playerId: string;
  playerToken: string;
  actions: string[];
  sendMessage: (message: string) => void;
}

const GameDetails: React.FC<GameDetailsProps> = ({
  game,
  playerId,
  playerToken,
  actions,
  sendMessage,
}) => {
  if (!game) {
    return null; // Or a loading indicator, or a message
  }

  const handleActionSubmit = (actionIndex: number) => {
    if (game && playerId && playerToken && actions[actionIndex] !== undefined) {
      const actionData = {
        gameId: game.id,
        playerId: playerId,
        playerToken: playerToken,
        actionIndex: actionIndex, // Send the index
      };
      sendMessage(JSON.stringify({ action: "doAction", data: actionData }));
    }
  };

  return (
    <div>
      <h2>Game Details</h2>
      <p>
        <strong>ID:</strong> {game.id}
      </p>
      <p>
        <strong>State:</strong> {game.state}
      </p>
      <p>
        <strong>Players:</strong> {game.playerIds.join(", ")}
      </p>
      <p>
        <strong>Max Players:</strong> {game.settings.maxPlayers}
      </p>
      <p>
        <strong>Players who can act:</strong> {game.canAct.join(", ")}
      </p>
      <h3>Characters</h3>
      {game.characters.length > 0 ? (
        <ul>
          {game.characters.map((character) => (
            <li key={character.playerId}>
              Player: {character.playerId}, Character: {character.characterId}
            </li>
          ))}
        </ul>
      ) : (
        <p>No characters selected yet.</p>
      )}

      <h3>Messages</h3>
      {game.messages && game.messages.length > 0 ? (
        <ul>
          {game.messages.map((message, index) => (
            <li key={index}>
              <strong>{message.from}:</strong> {message.message}
            </li>
          ))}
        </ul>
      ) : (
        <p>No messages yet.</p>
      )}

      {game.state === "SELECTING_CHARACTERS" &&
        game.canAct.includes(playerId) && (
          <CharacterSelect
            gameId={game.id}
            playerId={playerId}
            playerToken={playerToken}
          />
        )}

      {game.state === "GAME_LOOP" && game.canAct.includes(playerId) && (
        <div>
          <h3>Available Actions:</h3>
          {actions.length > 0 ? (
            actions.map((action, index) => (
              <button key={index} onClick={() => handleActionSubmit(index)}>
                {action}
              </button>
            ))
          ) : (
            <p>No actions available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GameDetails;
