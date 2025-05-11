import React from "react";

interface MessageInputProps {
  onCreateGame: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onCreateGame }) => {
  return (
    <div>
      <button onClick={onCreateGame} style={{ marginLeft: 10 }}>
        Create Game
      </button>
    </div>
  );
};

export default MessageInput;
