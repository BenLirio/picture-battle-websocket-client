import React from "react";
import CharacterSelect from "./CharacterSelect";

interface GameDetailsProps {
  game: {
    id: string;
    playerIds: string[];
    state: "WAITING_FOR_PLAYERS" | "SELECTING_CHARACTERS" | "GAME_LOOP";
    canAct: string[];
    settings: {
      maxPlayers: number;
    };
    characters: Array<{
      playerId: string;
      characterId: string;
    }>;
  } | null;
  playerId: string;
  playerToken: string;
}

const GameDetails: React.FC<GameDetailsProps> = ({
  game,
  playerId,
  playerToken,
}) => {
  if (!game) {
    return null; // Or a loading indicator, or a message
  }

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
      {game.state === "SELECTING_CHARACTERS" &&
        game.canAct.includes(playerId) && (
          <CharacterSelect
            gameId={game.id}
            playerId={playerId}
            playerToken={playerToken}
          />
        )}
    </div>
  );
};

export default GameDetails;
