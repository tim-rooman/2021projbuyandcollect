import React, { useState, useEffect } from "react";
import "../css/AccountPage.css";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../Firebase-Config";

function AccountPage() {
  const [userData, setUserData] = useState();

  const logOut = async () => {
    signOut(auth)
      .then(() => {
        window.location = "/";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const docRef = doc(db, "Users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    setUserData(docSnap.data());
  }

  return (
    <div className="MainContainer">
      <div>
        <h1>Hello {userData !== undefined ? userData.FName : null}</h1>
      </div>
      <div className="infoContainer">
        <h2>Account info</h2>
        <div className="textContainer">
          <p>First name</p>
          <p>{userData !== undefined ? userData.FName : null}</p>
        </div>
        <div className="textContainer">
          <p>Last name</p>
          <p>{userData !== undefined ? userData.LName : null}</p>
        </div>
        <div className="textContainer">
          <p>Email address</p>
          <p>{auth.currentUser.email}</p>
        </div>
        <button onClick={logOut} type={"submit"}>
          Log out
        </button>
      </div>
    </div>
  );
}

export default AccountPage;
