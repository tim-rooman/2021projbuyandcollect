import React, { useState } from "react";
import { db, auth } from "../Firebase-Config";
import { collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Modal from "react-modal";

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

function AddForSalePage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [buttonDisabled, SetButtonDisabled] = useState(false);

  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [selectedFileError, setSelectedFileError] = useState("");

  const [modalIsOpen, setIsOpen] = React.useState(false);

  const storage = getStorage();

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const redirectToHome = () => {
    window.location = "/";
  };

  const addItemForSale = () => {
    setNameError("");
    setDescriptionError("");
    setPriceError("");
    setLocationError("");
    setSelectedFileError(null);

    SetButtonDisabled(true);

    if (
      name !== "" &&
      description !== "" &&
      price !== "" &&
      price > 0 &&
      price < 5001 &&
      location !== "" &&
      selectedFile !== null
    ) {
      const storageRef = ref(storage, "Products/" + selectedFile.name);
      uploadBytes(storageRef, selectedFile)
        .then((snapshot) => {
          console.log("Uploaded picture!");
          getDownloadURL(ref(storage, "Products/" + selectedFile.name)).then(
            (url) => {
              addDoc(collection(db, "Products"), {
                Name: name,
                Description: description,
                Price: price,
                Location: location,
                PictureName: selectedFile.name,
                PictureURL: url,
                OwnerUID: auth.currentUser.uid,
              });
              openModal();
            }
          );
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      if (name === "") {
        setNameError("Please enter a name");
      }
      if (description === "") {
        setNameError("Please enter a description");
      }
      if (price === "") {
        setPriceError("Please enter a price");
      }
      if (price < 0) {
        setPriceError("Prices can't be lower than zero");
      }
      if (price > 5000) {
        setPriceError("Prices can't be higher than 5000");
      }
      if (location === "") {
        setLocationError("Please select a pickup location");
      }
      if (selectedFile === null) {
        setSelectedFileError("Please add a picture of your product");
      }
      SetButtonDisabled(false);
    }
  };

  const fileSelectedHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <div className="MainContainer">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Product added successfully"
      >
        <h2 id="titleSuccess">Succes!</h2>
        <p>
          Your item has been added successfully! Press the button below to
          redirect back to home.
        </p>

        <button className="close-modal" onClick={redirectToHome}>
          Redirect
        </button>
      </Modal>

      <div className="infoContainer">
        <h2>Enter sale data</h2>
        <input
          placeholder="Item name"
          onChange={(event) => setName(event.target.value)}
        ></input>
        {nameError !== "" ? (
          <span className="errorMessage">{nameError}</span>
        ) : null}
        <input
          placeholder="Description (describe condition, extra way to contact you, etc)"
          onChange={(event) => setDescription(event.target.value)}
        ></input>
        {descriptionError !== "" ? (
          <span className="errorMessage">{descriptionError}</span>
        ) : null}
        <input
          placeholder="Item price"
          type={"number"}
          onChange={(event) => setPrice(event.target.value)}
        ></input>
        {priceError !== "" ? (
          <span className="errorMessage">{priceError}</span>
        ) : null}
        <select onChange={(event) => setLocation(event.target.value)}>
          <option disabled defaultValue hidden>
            Pickup location
          </option>
          <option value="Aalst">Aalst</option>
          <option value="Antwerp">Antwerp</option>
          <option value="Bruges">Bruges</option>
          <option value="Brussels">Brussels</option>
          <option value="Genk">Genk</option>
          <option value="Ghent">Ghent</option>
          <option value="Hasselt">Hasselt</option>
          <option value="Kortrijk">Kortrijk</option>
          <option value="Leuven">Leuven</option>
          <option value="Mechelen">Mechelen</option>
          <option value="Oostende">Oostende</option>
          <option value="Roeselare">Roeselare</option>
          <option value="Sint-Niklaas">Sint-Niklaas</option>
          <option value="Turnhout">Turnhout</option>
        </select>
        {locationError !== "" ? (
          <span className="errorMessage">{locationError}</span>
        ) : null}
        <input type={"file"} onChange={fileSelectedHandler}></input>
        {selectedFileError !== "" ? (
          <span className="errorMessage">{selectedFileError}</span>
        ) : null}
        <button
          onClick={addItemForSale}
          type="submit"
          disabled={buttonDisabled}
        >
          Offer Item for sale
        </button>
      </div>
    </div>
  );
}

export default AddForSalePage;
