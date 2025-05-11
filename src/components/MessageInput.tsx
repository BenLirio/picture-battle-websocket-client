import React from "react";

interface MessageInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onCreateGame: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  input,
  onInputChange,
  onSendMessage,
  onCreateGame,
}) => {
  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="Type a message"
        style={{ width: 300, marginRight: 10 }}
      />
      <button onClick={onSendMessage}>Send</button>
      <button onClick={onCreateGame} style={{ marginLeft: 10 }}>
        Create Game
      </button>
    </div>
  );
};

export default MessageInput;
