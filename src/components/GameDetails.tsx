import React from "react";

interface GameDetailsProps {
  game: {
    id: string;
    playerIds: string[];
    state: "WAITING_FOR_PLAYERS" | "SELECTING_CHARACTERS";
    settings: {
      maxPlayers: number;
    };
  } | null;
}

const GameDetails: React.FC<GameDetailsProps> = ({ game }) => {
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
    </div>
  );
};

export default GameDetails;
