import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import "./Messages.scss";
import MessagesSidebar from "./MessagesSidebar";
import { ActiveClient, getActiveClients } from "../../services/collaborationService";
import { getCollaborationMessages, saveMessage } from "../../services/messageService";
import { useMessageContext } from "../../Context/MessageContext";

interface Message {
  sender: string;
  text: string;
}

const Messages = () => {
  const socket = useMessageContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedClient, setSelectedClient] = useState<ActiveClient | null>(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!socket || !selectedClient?.collaborationId) return;

    socket.emit(
      "joinCollaboration",
      selectedClient.collaborationId,
      (ack: { error?: string }) => {
        if (ack.error) {
          console.error(ack.error);
        }
      }
    );

    socket.on(
      "newMessage",
      (data: {
        collaborationId: string;
        message: { content: string; sender: string; timestamp: number };
      }) => {
        if (data.collaborationId === selectedClient.collaborationId) {
          setMessages((prevMessages) => [
            {
              sender: data.message.sender === selectedClient.clientId ? "client" : "coach",
              text: data.message.content,
            },
            ...prevMessages,
          ]);
        }
      }
    );

    socket.on("error", (err: Error) => {
      console.error("Socket error:", err.message);
    });

    return () => {
      socket.off("newMessage");
      socket.off("error");
    };
  }, [socket, selectedClient]);

  const handleClientSelect = async (client: ActiveClient) => {
    setSelectedClient(client);
    await fetchMessages(client.clientId, client.collaborationId);
  };

  const fetchMessages = async (clientId: string, collaborationId: string) => {
    try {
      const messages = await getCollaborationMessages(collaborationId);
      if (messages) {
        const sortedMessages = messages.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        const mappedMessages = sortedMessages.map((message) => ({
          sender: message.sender === clientId ? "client" : "coach",
          text: message.content,
        }));

        setMessages(mappedMessages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedClient?.collaborationId) {
      try {
        await saveMessage(newMessage, selectedClient.collaborationId);
        setMessages((prevMessages) => [
          { sender: "coach", text: newMessage },
          ...prevMessages,
        ]);
        setNewMessage("");
      } catch (error) {
        console.error("Error saving message:", error);
        alert(
          "Error sending message. Please check your connection and try again."
        );
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="messages-container">
      <div className="messages-layout">
        <MessagesSidebar 
          onClientSelect={handleClientSelect}
          selectedClientId={selectedClient?.clientId}
        />
        <div className="messages-content">
          {selectedClient ? (
            <>
              <div className="client-desc">
                <img src={selectedClient.clientImage} alt="Client" />
                <div className="client-details">
                  <h4>{`${selectedClient.firstName} ${selectedClient.lastName}`}</h4>
                  <p>{selectedClient.email}</p>
                  <p>
                    Client Since:{" "}
                    {new Date(selectedClient.startDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>

              <div className="chat-area overflow-y-auto">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`message-bubble ${
                      message.sender === "coach"
                        ? "coach-message"
                        : "client-message"
                    }`}
                  >
                    {message.text}
                  </div>
                ))}
              </div>

              <div className="message-input-container">
                <input
                  type="text"
                  className="message-input"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message"
                />
                <button className="send-button" onClick={handleSendMessage}>
                  <Icon icon="mdi:send" />
                </button>
              </div>
            </>
          ) : (
            <div className="no-client-selected">
              <p>Select a client to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;