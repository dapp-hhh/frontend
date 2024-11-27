import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./createProduct.css";
import getContract from "../../contract";  // 导入getContract

const ProductForm = ({ addProduct }) => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [productgrade, setProductgrade] = useState("");
  const navigate = useNavigate();

  // 处理表单提交
  const handleSubmit = async () => {
    const contract = getContract();
    
    if (!contract) {
      alert("Contract not found!");
      return;
    }

    try {
      // 调用智能合约的createJewelry函数，传入描述
      const transaction = await contract.createJewelry(description);
      console.log("Transaction Details:", transaction);
console.log("Receipt Details:", await transaction.wait());
      // 等待交易确认
      await transaction.wait();

      // 构造新产品对象
      const newProduct = {
        id: Date.now(), // 使用当前时间戳生成唯一 ID
        name: productName,
        thumbnail: "https://via.placeholder.com/150",
        currentStage: "MINED", // 初始阶段为未铸造
        grade: productgrade || "VVS1", // 使用输入的品级或默认品级
      };

      // 调用父组件传递的 addProduct 方法来更新 diamonds
      addProduct(newProduct);
      alert("Jewelry created successfully!");
      
      navigate("/"); // 提交后跳转回主页
    } catch (error) {
      console.error("Error creating jewelry:", error);
      alert("Error creating jewelry. Please try again.");
    }
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
          placeholder="Product grade"
          value={productgrade}
          onChange={(e) => setProductgrade(e.target.value)}
        />
        <button className="submit-button" onClick={handleSubmit}>
          Enter
        </button>
      </div>
    </div>
  );
};

export default ProductForm;
