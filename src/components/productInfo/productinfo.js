import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "antd";
import "./productinfo.css";

const ProductInfo = () => {
  const { id } = useParams(); // 从路由中获取珠宝ID
  const [jewelry, setJewelry] = useState(null);

  // 模拟从区块链获取详细信息
  useEffect(() => {
    const mockJewelryDetail = {
      id: id,
      CAId: 101,
      description: "Diamond Ring",
      currentOwner: "0x1234...abcd",
      status: "Minted",
      timestamp: "2024-11-24",
    };
    setJewelry(mockJewelryDetail);
  }, [id]);

  if (!jewelry) return <div>Loading...</div>;

  return (
    <div className="jewelry-detail-container">
      <Card title={`Jewelry ID: ${jewelry.id}`} bordered={false}>
        <p><b>CAId:</b> {jewelry.CAId}</p>
        <p><b>Description:</b> {jewelry.description}</p>
        <p><b>Current Owner:</b> {jewelry.currentOwner}</p>
        <p><b>Status:</b> {jewelry.status}</p>
        <p><b>Last Updated:</b> {jewelry.timestamp}</p>
      </Card>
    </div>
  );
};

export default ProductInfo;

