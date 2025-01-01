import "./styles.css";
import Login from "./Componenets/Login/Login.js";
import Chat from "./Componenets/Chat/Chat";
import Main from "./Componenets/Main/Main.js";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
export default function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login setIsAuth={setIsAuth} />} />
          <Route
            path="/main"
            element={<Main setIsAuth={setIsAuth} isAuth={isAuth} />}
          />
          <Route path="/Chat" element={<Chat />} />
        </Routes>
      </Router>
    </div>
  );
}
