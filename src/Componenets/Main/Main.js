import React, { useState, useEffect, useRef } from "react";
import Chat from "../Chat/Chat";
import "./main.css";
import notificationIcon from "../../../Images/bell.png";
import sendBtn from "../../../Images/sendBtn.png";
import chatboticon from "../../../Images/chatbot.png";
import Loader from "../Loader/Loader.js";

function Main() {
  const [inputText, setInputText] = useState(""); // To store user input
  const [chatHistory, setChatHistory] = useState([]); // To store chat history (key-value pairs)
  const [error, setError] = useState(null); // To store errors
  const chatContainerRef = useRef(null);

  // Load chat history from local storage when component mounts
  useEffect(() => {
    const savedChatHistory = localStorage.getItem("chatHistory");
    if (savedChatHistory) {
      setChatHistory(JSON.parse(savedChatHistory));
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const fetchAIContent = async () => {
    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyC-m-RJd8aZVRZeArNTbO09hYAImDcT4ks";

    const payload = {
      contents: [
        {
          parts: [
            {
              text:
                "if the following text is related to medical query or small talk you can respond, if not repond that i dont have info" +
                inputText, // Use user input here
            },
          ],
        },
      ],
    };
    const botResponse = "Bot is typing";
    const newChatHistory = [
      ...chatHistory,
      {
        user: inputText,
        bot: botResponse,
      },
    ];
    setChatHistory(newChatHistory);
    setInputText("");

    const response = fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    response
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const newChatHistory = [
          ...chatHistory,
          {
            user: inputText,
            bot: data.candidates[0].content.parts[0].text,
          },
        ];
        setChatHistory(newChatHistory);

        // Save updated chat history to local storage
        localStorage.setItem("chatHistory", JSON.stringify(newChatHistory));

        setInputText(""); // Clear input field after sending
        setError(null);
      });
  };
  return (
    <div className="main">
      <div className="sideNav"></div>
      <div className="containerMain">
        <div className="topBannerMain">
          <div className="LogoMain">
            <img src={chatboticon} />
            <span>Buddy</span>
          </div>
          <div className="rightTopbannermain">
            <img src={notificationIcon} />
            <img src={localStorage.photoURL} />
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
                  <div className="botChat">
                    {chat.bot === "Bot is typing" ? (
                      <div>
                        <Loader />
                      </div>
                    ) : (
                      <div className="botResponsebulbe">
                        <strong>Bot: </strong>
                        {chat.bot}
                      </div>
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
            onClick={fetchAIContent}
            disabled={!inputText.trim()}
          >
            <img src={sendBtn} />
          </button>
        </div>
      </div>
    </div>
  );
}
export default Main;
