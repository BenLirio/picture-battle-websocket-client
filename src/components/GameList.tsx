import React from "react";

interface GameListProps {
  games: string[];
  onGameClick?: (gameId: string) => void;
}

const GameList: React.FC<GameListProps> = ({ games, onGameClick }) => {
  return (
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
              onClick={() => onGameClick && onGameClick(gameId)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (onGameClick) {
                    onGameClick(gameId);
                  }
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
  );
};

export default GameList;
