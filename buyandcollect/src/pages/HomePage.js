import React, { useState, useEffect } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../Firebase-Config";
import { useNavigate } from "react-router-dom";

function Homepage() {
  const [productsFinalList, setProductsFinalList] = useState();
  const [docIDsFinalList, setdocIDsFinalList] = useState();

  let navigate = useNavigate();
  const routeChange = (productId) => {
    let path = `items/` + productId;
    navigate(path);
  };

  useEffect(() => {
    getProducts();
  }, []);

  async function getProducts() {
    const products = [];
    const docIDs = [];
    const q = query(collection(db, "Products"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      products.push(doc.data());
      docIDs.push(doc.id);
    });
    setProductsFinalList(products);
    setdocIDsFinalList(docIDs);
  }

  return (
    <div className="MainSaleContainer">
      {productsFinalList !== undefined ? (
        productsFinalList.map((product, index) => {
          return (
            <div
              className="ProductContainer"
              onClick={() => routeChange(docIDsFinalList[index])}
              key={index}
            >
              <img src={product.PictureURL} alt={product.PictureName}></img>
              <div className="ProductInfoContainer">
                <div className="InnerText">
                  <p className="oneLineOnly">€ {product.Price}</p>
                  <p className="oneLineOnly">{product.Name}</p>
                </div>
                <p>Pickup location: {product.Location} </p>
              </div>
            </div>
          );
        })
      ) : (
        <p>No items found.</p>
      )}
    </div>
  );
}

export default Homepage;
