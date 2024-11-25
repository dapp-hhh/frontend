import React, { useState } from "react";
import "./createProduct.css";

const ProductForm = () => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [productStage, setProductStage] = useState("");

  const handleSubmit = () => {
    console.log("Product Name:", productName);
    console.log("Description:", description);
    console.log("Product Stage:", productStage);
  };

  return (
    <div className="product-form-container">
      <div className="product-form-box">
        <input
          className="input-field product-name"
          type="text"
          placeholder="Enter the product name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <textarea
          className="input-field description"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className="input-field product-stage"
          type="text"
          placeholder="Product Stage"
          value={productStage}
          onChange={(e) => setProductStage(e.target.value)}
        />
        <button className="submit-button" onClick={handleSubmit}>
          Enter
        </button>
      </div>
    </div>
  );
};

export default ProductForm;

