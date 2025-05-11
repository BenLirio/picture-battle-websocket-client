import React from "react";

interface PlayerInfoProps {
  playerId: string | null;
  playerToken: string | null;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ playerId, playerToken }) => {
  return (
    <div
      style={{
        marginTop: 20,
        fontWeight: "bold",
        borderTop: "1px solid #666",
        paddingTop: 10,
      }}
    >
      playerId: {playerId === null ? "<loading...>" : playerId}
      <br />
      playerToken: {playerToken === null ? "<loading...>" : playerToken}
    </div>
  );
};

export default PlayerInfo;
