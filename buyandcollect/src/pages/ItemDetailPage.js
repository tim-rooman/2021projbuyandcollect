import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../Firebase-Config";
//import { v1 as uuidv1 } from "uuid";
import Modal from "react-modal";

import "../css/detailpage.css";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

function ItemDetailPage() {
  let { id } = useParams();
  let subtitle;
  const [productData, setProductData] = useState();
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [modalIsOpen2, setIsOpen2] = React.useState(false);
  const [unlockCode, setUnlockCode] = useState();

  useEffect(() => {
    getProduct();
    // eslint-disable-next-line
  }, []);

  async function getProduct() {
    const docRef = doc(db, "Products", id);
    const docSnap = await getDoc(docRef);
    setProductData(docSnap.data());
  }

  function checkBeforeBuyProduct() {
    if (auth.currentUser) {
      openModal();
    } else {
      window.location = "/login";
    }
  }

  async function buyProduct() {
    let min = 1;
    let max = 1000000;
    let rand = Math.floor(min + Math.random() * (max - min));
    //let tempCode = uuidv1();
    openModal2();
    closeModal();
    setUnlockCode(rand);

    fetch("http://192.168.1.35:3000/body", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: rand,
    });

    await deleteDoc(doc(db, "Products", id));
  }

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }

  function openModal2() {
    setIsOpen2(true);
  }

  function closeModal2() {
    setIsOpen2(false);
    window.location = "/";
  }

  return (
    <div className="mainContainer">
      <h1 className="title">{productData ? productData.Name : null}</h1>
      <div>
        <div className="imageContainer">
          {productData ? (
            <img src={productData.PictureURL} alt={productData.PictureName} />
          ) : null}
          <p className="itemDescription">
            {productData ? productData.Description : null}
          </p>
          <p>Pickup location: {productData ? productData.Location : null}</p>
        </div>
        <div className="lowerContainer">
          <div className="priceContainer">
            <span className="priceLabel">Price:</span>
            <span>€{productData ? productData.Price : null}</span>
          </div>
          <button className="button" onClick={checkBeforeBuyProduct}>
            Buy product
          </button>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Buying confirmation"
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>
          Are you certain that you want to buy this?
        </h2>
        <button onClick={buyProduct}>Buy product</button>
        <button onClick={closeModal}>Do not buy product</button>
      </Modal>
      <Modal
        isOpen={modalIsOpen2}
        onRequestClose={closeModal2}
        style={customStyles}
        contentLabel="Accepted purchase"
      >
        <h2>You have succesfully bought the product.</h2>
        <p>
          Please make sure to take a picture of this message to remember the
          code needed to access the locker.
        </p>
        <p>Product name: {productData ? productData.Name : null}</p>
        <p>Pickup location: {productData ? productData.Location : null}</p>
        <p>Your code is: {unlockCode}</p>
        <button onClick={closeModal2}>Return to home</button>
      </Modal>
    </div>
  );
}

export default ItemDetailPage;
