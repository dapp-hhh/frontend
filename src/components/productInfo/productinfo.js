import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Button, message } from "antd";
import "./productinfo.css";
import getContract from "/Users/yishu/Desktop/frontend/src/contract";

const ProductInfo = ({ diamonds, setDiamonds }) => {
  const { id } = useParams(); // 从路由中获取珠宝ID
  const [jewelry, setJewelry] = useState(null);

  useEffect(() => {
    // 查找当前珠宝并设置状态
    const diamond = diamonds.find((diamond) => diamond.id === parseInt(id));
    if (diamond) {
      setJewelry(diamond);
    }
  }, [id, diamonds]);

  const handleLifecycleUpdate = async (stage) => {
    try {
      const contract = await getContract();
      const currentTime = new Date().toISOString();

      // 更新珠宝的生命周期状态
      setJewelry((prevJewelry) => {
        const updatedJewelry = { ...prevJewelry, currentStage: stage, timestamp: currentTime };

        // 根据阶段更新时间戳
        switch(stage) {
          case "Mining":
            updatedJewelry.miningTimestamp = currentTime;
            break;
          case "Cutting & Polishing":
            updatedJewelry.cuttingTimestamp = currentTime;
            break;
          case "Laser Engraving":
            updatedJewelry.engravingTimestamp = currentTime;
            break;
          case "Designing & Inlaying":
            updatedJewelry.designTimestamp = currentTime;
            break;
          case "Customer Purchasing":
            updatedJewelry.purchasingTimestamp = currentTime;
            break;
          case "Ownership Transferred":
            updatedJewelry.ownershipTransferredTimestamp = currentTime;
            break;
          default:
            break;
        }

        // 更新整个 diamonds 数组
        const updatedDiamonds = diamonds.map((diamond) =>
          diamond.id === prevJewelry.id ? updatedJewelry : diamond
        );
        setDiamonds(updatedDiamonds);
        message.success(`Successfully updated to: ${stage}`);
        return updatedJewelry;
      });
    } catch (error) {
      message.error(`Failed to update lifecycle stage: ${stage}`);
    }
  };

  const getLifecycleStatusClass = (timestamp) => {
    if (timestamp) {
      const currentDate = new Date();
      const timestampDate = new Date(timestamp);
      if (timestampDate <= currentDate) {
        return "completed";  // 已完成
      } else {
        return "in-progress"; // 进行中
      }
    } else {
      return "pending"; // 待完成
    }
  };

  const displayLifecycleDetails = (jewelry) => {
    const stages = [
      { stage: "Mining", timestamp: jewelry.miningTimestamp },
      { stage: "Cutting & Polishing", timestamp: jewelry.cuttingTimestamp },
      { stage: "Laser Engraving", timestamp: jewelry.engravingTimestamp },
      { stage: "Designing & Inlaying", timestamp: jewelry.designTimestamp },
      { stage: "Customer Purchasing", timestamp: jewelry.purchasingTimestamp },
      { stage: "Ownership Transferred", timestamp: jewelry.ownershipTransferredTimestamp },
    ];

    return (
      <div className="lifecycle-details">
        <h3>Lifecycle Details</h3>
        {stages.map((stage) => (
          <div
            className={`lifecycle-stage ${getLifecycleStatusClass(stage.timestamp)}`}
            key={stage.stage}
          >
            <span>{stage.stage}</span>
            <span>{stage.timestamp || "Not yet updated"}</span>
          </div>
        ))}
      </div>
    );
  };

  if (!jewelry) return <div>Loading...</div>;

  return (
    <div className="jewelry-detail-container">
      <Card title={`Jewelry ID: ${jewelry.id}`} bordered={false}>
        <p><b>Description:</b> {jewelry.name}</p>
        <p><b>Current Stage:</b> {jewelry.currentStage}</p>
        <p><b>Grade:</b> {jewelry.grade}</p>
        <p><b>Last Updated:</b> {jewelry.timestamp}</p>
      </Card>

      {/* 显示生命周期详情 */}
      {displayLifecycleDetails(jewelry)}

      <div className="button-group">
        <Button onClick={() => handleLifecycleUpdate("Mining")} type="primary">Mining</Button>
        <Button onClick={() => handleLifecycleUpdate("Cutting & Polishing")} type="primary">Cutting & Polishing</Button>
        <Button onClick={() => handleLifecycleUpdate("Laser Engraving")} type="primary">Laser Engraving</Button>
        <Button onClick={() => handleLifecycleUpdate("Designing & Inlaying")} type="primary">Designing & Inlaying</Button>
        <Button onClick={() => handleLifecycleUpdate("Customer Purchasing")} type="primary">Customer Purchasing</Button>
        <Button onClick={() => handleLifecycleUpdate("Ownership Transferred")} type="primary">Ownership Transferred</Button>
      </div>
    </div>
  );
};

export default ProductInfo;