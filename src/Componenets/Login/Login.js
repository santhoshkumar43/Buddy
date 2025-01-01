import React from "react";
import "./Login.css";
import google from "../../../Images/googleImg.png";
import { auth, provider } from "../../firebase.js";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import chatboticon from "../../../Images/chatbot.png";

function Login({ setIsAuth }) {
  let navigate = useNavigate();

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
      localStorage.setItem("isAuth", true);
      localStorage.setItem("name", auth.currentUser.displayName);
      localStorage.setItem("photoURL", auth.currentUser.photoURL);
      setIsAuth(true);
      navigate("/main");
    });
  };

  return (
    <div className="main-login">
      <div className="banner-login">
        <img src={chatboticon} />
        <p> Buddy.</p>
      </div>
      <div className="container-login">
        <div className="in-cont-login">
          <div className="heading-login">
            <h1>Sign in</h1>
            <p className="desc-login">Sign in to your account</p>

            <div className="in-heading-login">
              {" "}
              <button onClick={signInWithGoogle}>
                <img src={google} />
                <p>Sign in with Google</p>
              </button>
              <button>
                <img src={google} />
                <p>Sign in with Apple</p>
              </button>
            </div>
          </div>
          <div className="input-login">
            <p>Email address</p>
            <input placeholder="johndoe@gmail.com" type="email" />
            <p>Paswword</p>
            <input type="password" placeholder="••••••••" />
            <p>
              <a href="#">Forget password</a>
            </p>
            <button>Sign in</button>
          </div>
          <p className="reg-login">
            Don't have an account? <a href="#">Regester Here</a>
          </p>
        </div>
      </div>
    </div>
  );
}
export default Login;
