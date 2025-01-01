import React, { useState, useEffect, useRef } from "react";

const Chat = () => {
  const [inputText, setInputText] = useState(""); // To store user input
  const [chatHistory, setChatHistory] = useState([]); // To store chat history (key-value pairs)
  const [error, setError] = useState(null); // To store errors
  const chatContainerRef = useRef(null); // Ref to the chat container for scrolling

  // Load chat history from local storage when component mounts
  useEffect(() => {
    const savedChatHistory = localStorage.getItem("chatHistory");
    if (savedChatHistory) {
      setChatHistory(JSON.parse(savedChatHistory));
    }
  }, []);

  // Scroll to the bottom whenever chatHistory changes or on component mount
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const fetchAIContent = async () => {
    if (!inputText.trim()) return; // Prevent empty input submissions

    const userMessage = { user: inputText, bot: "Bot is typing..." };
    const updatedChatHistory = [...chatHistory, userMessage];
    setChatHistory(updatedChatHistory); // Add user message and placeholder bot response
    setInputText(""); // Clear input field

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=GEMINI_API_KEY";

    const payload = {
      contents: [
        {
          parts: [
            {
              text: inputText, // Use user input here
            },
          ],
        },
      ],
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      const botResponse = data?.response || "No response from bot.";

      // Replace "Bot is typing..." with actual bot response
      const finalChatHistory = updatedChatHistory.map((chat, index) =>
        index === updatedChatHistory.length - 1
          ? { user: chat.user, bot: botResponse }
          : chat
      );
      setChatHistory(finalChatHistory);

      // Save updated chat history to local storage
      localStorage.setItem("chatHistory", JSON.stringify(finalChatHistory));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>AI Chat</h1>

      {/* Chat History */}
      <div
        ref={chatContainerRef}
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "300px",
          overflowY: "scroll",
          marginBottom: "10px",
        }}
      >
        {chatHistory.length === 0 ? (
          <p>No chat history yet.</p>
        ) : (
          chatHistory.map((chat, index) => (
            <div key={index} style={{ marginBottom: "15px" }}>
              <div
                style={{
                  backgroundColor: "#f1f1f1",
                  padding: "10px",
                  borderRadius: "10px",
                  marginBottom: "5px",
                }}
              >
                <strong>You:</strong> {chat.user}
              </div>
              <div
                style={{
                  backgroundColor:
                    chat.bot === "Bot is typing..." ? "#ffeb3b" : "#e0f7fa",
                  padding: "10px",
                  borderRadius: "10px",
                }}
              >
                <strong>Bot:</strong> {chat.bot}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Field */}
      <input
        type="text"
        placeholder="Ask something..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)} // Update state on input change
        style={{
          padding: "10px",
          width: "100%",
          marginBottom: "10px",
          borderRadius: "5px",
        }}
      />

      {/* Buttons */}
      <button
        onClick={fetchAIContent}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Send to AI
      </button>

      {/* Error Message */}
      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>Error: {error}</p>
      )}
    </div>
  );
};

export default Chat;
