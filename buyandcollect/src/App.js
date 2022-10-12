import React, { useState } from "react";
import "./css/App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
import CreateAcc from "./pages/CreateAccPage";
import Item from "./pages/ItemDetailPage";
import AddForSale from "./pages/AddForSalePage";
import OwnForSale from "./pages/OwnForSalePage";
import Account from "./pages/AccountPage";

import { auth } from "./Firebase-Config";
import { onAuthStateChanged } from "firebase/auth";

import logo from "./Images/logo.png";

function App() {
  const [isUser, setIsUser] = useState(false);

  onAuthStateChanged(auth, () => {
    if (auth.currentUser) {
      setIsUser(true);
    } else {
      console.log("No user is logged in.");
      setIsUser(false);
    }
  });

  return (
    <Router>
      <nav>
        <div className="logoContainer">
          {isUser === true ? (
            <Link to={"/"}>
              <img id="logo" src={logo} alt="Logo of website" />
            </Link>
          ) : null}
        </div>
        <div id={isUser === true ? "navButtons" : "navButtonsNotLoggedIn"}>
          {isUser === true ? (
            <>
              <Link className="NavLink" to={"/"}>
                Return home
              </Link>
              <Link className="NavLink" to={"/sell-item"}>
                Sell item
              </Link>
              <Link className="NavLink" to={"/your-items-for-sale"}>
                Your items for sale
              </Link>
              <Link className="NavLink" to={"/account"}>
                Account
              </Link>
            </>
          ) : (
            <Link className="NavLink" to={"/login"}>
              Log in
            </Link>
          )}
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAcc />} />
        <Route path="/sell-item" element={<AddForSale />} />
        <Route path="/your-items-for-sale" element={<OwnForSale />} />
        <Route path="/account" element={<Account />} />
        <Route path="/items/:id" element={<Item />} />
      </Routes>
    </Router>
  );
}

export default App;
