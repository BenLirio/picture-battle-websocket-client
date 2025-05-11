import React from "react";

interface MessageListProps {
  messages: string[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div
      style={{
        marginTop: 20,
        maxHeight: 300,
        overflowY: "auto",
        border: "1px solid #ccc",
        padding: 10,
      }}
    >
      {messages.map((msg, idx) => (
        <div key={idx} style={{ marginBottom: 5 }}>
          {msg}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
