import React, { useState } from "react";
import { useWebSocket } from "../socket";

interface CharacterSelectProps {
  gameId: string;
  playerId: string;
  playerToken: string;
}

const CharacterSelect: React.FC<CharacterSelectProps> = ({
  gameId,
  playerId,
  playerToken,
}) => {
  const [characterName, setCharacterName] = useState("");
  const { sendMessage } = useWebSocket();

  const handleSelectCharacter = () => {
    if (characterName.trim()) {
      sendMessage(
        JSON.stringify({
          action: "selectCharacter",
          data: {
            gameId,
            playerId,
            playerToken,
            characterName: characterName.trim(),
          },
        })
      );
      setCharacterName(""); // Clear input after sending
    }
  };

  return (
    <div>
      <h3>Select Your Character</h3>
      <input
        type="text"
        value={characterName}
        onChange={(e) => setCharacterName(e.target.value)}
        placeholder="Enter character name"
      />
      <button onClick={handleSelectCharacter}>Select Character</button>
    </div>
  );
};

export default CharacterSelect;
