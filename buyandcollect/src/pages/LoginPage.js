import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase-Config";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const logIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location = "/";
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <div className="MainContainer">
        <div className="infoContainer">
          <h2>Sign in to Buy&collect</h2>
          <input
            onChange={(event) => setEmail(event.target.value)}
            placeholder={"Enter Email"}
            type={"email"}
          />
          <input
            onChange={(event) => setPassword(event.target.value)}
            placeholder={"Enter Password"}
            type={"password"}
          />
          <button onClick={logIn} type={"submit"}>
            Sign in
          </button>
          <p>Or</p>
          <button onClick={() => (window.location = "/create-account")}>
            Make a new account
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
