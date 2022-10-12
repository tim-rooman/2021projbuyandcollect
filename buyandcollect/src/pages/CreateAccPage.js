import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../Firebase-Config";
import { doc, setDoc } from "firebase/firestore";

function CreateAccPage() {
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const addUserData = async () => {
    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    if (fName !== "" && lName !== "" && email !== "" && password !== "") {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "Users", auth.currentUser.uid), {
          FName: fName,
          LName: lName,
          UserUID: auth.currentUser.uid,
        }).catch((error) => {
          console.log(error);
        });
        window.location = "/";
      } catch (error) {
        setGeneralError(error.message);
      }
    } else {
      if (fName === "") {
        setFirstNameError("Please enter your first name");
      }
      if (lName === "") {
        setLastNameError("Please enter your last name");
      }
      if (email === "") {
        setEmailError("Please enter your email");
      }
      if (password === "") {
        setPasswordError("Please enter your password");
      }
    }
  };

  return (
    <div>
      <div className="MainContainer">
        <div className="infoContainer">
          <h2>Create account for Buy&collect</h2>
          <input
            onChange={(event) => setFName(event.target.value)}
            placeholder={"Enter first name"}
          />
          {firstNameError !== "" ? (
            <span className="errorMessage">{firstNameError}</span>
          ) : null}
          <input
            onChange={(event) => setLName(event.target.value)}
            placeholder={"Enter last name"}
          />
          {lastNameError !== "" ? (
            <span className="errorMessage">{lastNameError}</span>
          ) : null}
          <input
            onChange={(event) => setEmail(event.target.value)}
            placeholder={"Enter Email"}
            type={"email"}
          />
          {emailError !== "" ? (
            <span className="errorMessage">{emailError}</span>
          ) : null}
          <input
            onChange={(event) => setPassword(event.target.value)}
            placeholder={"Enter Password"}
            type={"password"}
          />
          {passwordError !== "" ? (
            <span className="errorMessage">{passwordError}</span>
          ) : null}
          {generalError !== "" ? (
            <span className="errorMessage">{generalError}</span>
          ) : null}
          <button onClick={addUserData} type={"submit"}>
            Make a new account
          </button>
          <p>Or</p>
          <button onClick={() => (window.location = "/login")}>Sign in</button>
        </div>
      </div>
    </div>
  );
}

export default CreateAccPage;
