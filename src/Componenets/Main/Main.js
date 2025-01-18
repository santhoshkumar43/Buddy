import React, { useState, useEffect, useRef } from "react";
import Chat from "../Chat/Chat";
import "./main.css";
import notificationIcon from "../../Images/bell.png";
import sendBtn from "../../Images/sendBtn.png";
import chatboticon from "../../Images/chatbot.png";
import Loader from "../Loader/Loader.js";
import { useNavigate } from "react-router-dom";

function Main() {
  const [inputText, setInputText] = useState(""); // To store user input
  const [chatHistory, setChatHistory] = useState([]); // To store chat history (key-value pairs)
  const [error, setError] = useState(null); // To store errors
  const [isLoading, setIsLoading] = useState(false); // To control loading spinner
  const chatContainerRef = useRef(null);
  const socketRef = useRef(null); // Reference to the WebSocket connection

  const userId = localStorage.getItem("UID"); // Use dynamic user ID from login/authentication context
  let navigate = useNavigate();
  if (localStorage.getItem("isAuth") != "true") {
    navigate("/");
  }
  // Establish WebSocket connection and fetch chat history
  useEffect(() => {
    // Establish WebSocket connection with userId as a query parameter
    socketRef.current = new WebSocket(
      `https://buddy-backend-eggw.onrender.com/?userId=${userId}`
    );

    // Handle incoming WebSocket messages (including initial chat history)
    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // When the connection is established, the server sends the chat history
      if (data.type === "previousMessages") {
        const parsedHistory = data.messages.map((message) => ({
          user: message.user,
          bot: message.bot,
        }));
        setChatHistory(parsedHistory);
      } else if (data.type === "newMessage") {
        // Handle new message from WebSocket server
        setChatHistory((prevHistory) => {
          const updatedHistory = [...prevHistory];
          updatedHistory[updatedHistory.length - 1].bot = data.message;
          return updatedHistory;
        });
        setIsLoading(false);
      }
    };

    // Cleanup WebSocket connection on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  // Scroll to the bottom of the chat area whenever chat history is updated
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const sendMessage = () => {
    if (inputText.trim() && socketRef.current) {
      const userMessage = inputText;
      const botMessage = "Bot is typing"; // Set a placeholder for the bot's reply

      // Add user input and bot placeholder to chat history
      setChatHistory((prevHistory) => [
        ...prevHistory,
        {
          user: userMessage,
          bot: botMessage,
        },
      ]);
      setInputText(""); // Clear input field

      // Send user message to WebSocket server
      socketRef.current.send(userMessage);
      setIsLoading(true); // Show the loading spinner while waiting for the bot's response
    }
  };

  return (
    <div className="main">
      <div className="sideNav"></div>
      <div className="containerMain">
        <div className="topBannerMain">
          <div className="LogoMain">
            <img src={chatboticon} alt="Logo" />
            <span>Buddy</span>
          </div>
          <div className="rightTopbannermain">
            <img src={notificationIcon} alt="Notification" />
            <img src={localStorage.photoURL} alt="User" />
          </div>
        </div>
        <div className="chatArea" ref={chatContainerRef}>
          {chatHistory.length === 0 ? (
            <p>No chat history yet.</p>
          ) : (
            chatHistory.map((chat, index) => (
              <div key={index} style={{ marginBottom: "15px" }}>
                <div className="outeruserChat">
                  <div className="userChat">{chat.user}</div>
                </div>
                <div className="outerbotChat">
                  <img src={chatboticon} alt="Bot" />
                  <div className="botChat">
                    {chat.bot === "Bot is typing" ? (
                      <Loader />
                    ) : (
                      <div className="botResponsebulbe">{chat.bot}</div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="bottomBar">
          <input
            className="chatInput"
            type="text"
            placeholder="Ask something..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)} // Update state on input change
          />
          <button
            className="chatSend"
            onClick={sendMessage}
            disabled={!inputText.trim()}
          >
            <img src={sendBtn} alt="Send" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Main;
