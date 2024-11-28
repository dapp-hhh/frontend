import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./createProduct.css"; // 引入样式文件
import getContract from "../../contract"; // 获取合约实例的方法

const CreateProduct = () => {
  const [productName, setProductName] = useState(""); // 额外的输入框 - 产品名称
  const [description, setDescription] = useState(""); // 产品描述
  const [productGrade, setProductGrade] = useState(""); // 额外的输入框 - 产品等级
  const [loading, setLoading] = useState(false); // 加载状态
  const navigate = useNavigate();

  const statusMapping = {
    0: "MINED",
    1: "POLISHED",
    2: "GRADED",
    3: "IN_STOCK",
    4: "DESIGNED",
    5: "SOLD",
  };

  const handleCreate = async () => {
    if (!description) {
      alert("Please enter a description for the product!");
      return;
    }

    setLoading(true);
    try {
      const contract = getContract();
      if (!contract) {
        console.error("Failed to load contract.");
        setLoading(false);
        return;
      }

      // 调用合约的 createJewelry 方法
      const tx = await contract.createJewelry(description);
      console.log("Transaction sent. Waiting for confirmation...", tx);

      // 等待交易确认
      const receipt = await tx.wait();
      console.log("Transaction confirmed.", receipt);

      // 获取新商品信息
      const jewelryCount = await contract.jewelryCount();
      const newJewelry = await contract.jewelries(jewelryCount);

      console.log("Newly Created Jewelry:", {
        id: newJewelry.id.toString(),
        description: newJewelry.description,
        status: statusMapping[newJewelry.status],
        timestamp: new Date(newJewelry.timestamp * 1000).toLocaleString(),
        owner: newJewelry.currentOwner,
      });

      alert("Product created successfully!");

      // 跳转回首页
      navigate("/");
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-container">
      
      <div className="product-form-box">
        {/* 输入框：产品名称 */}
        <input
          className="input-field product-name"
          type="text"
          placeholder="Enter the product name (optional)"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        {/* 输入框：描述 */}
        <textarea
          className="input-field description"
          placeholder="Enter the product description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        {/* 输入框：等级 */}
        <input
          className="input-field product-grade"
          type="text"
          placeholder="Enter the product grade (optional)"
          value={productGrade}
          onChange={(e) => setProductGrade(e.target.value)}
        />
        {/* 提交按钮 */}
        <button className="submit-button" onClick={handleCreate} disabled={loading}>
          {loading ? "Creating..." : "Create Product"}
        </button>
      </div>
    </div>
  );
};

export default CreateProduct;
