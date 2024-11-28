import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Button, message } from "antd";
import "./productinfo.css";
import getContract from "/Users/yishu/Desktop/frontend/src/contract";

const ProductInfo = ({ diamonds, setDiamonds }) => {
  const { id } = useParams(); // 从路由中获取珠宝ID
  const [jewelry, setJewelry] = useState(null);
  
  // 映射阶段名称与智能合约中的状态
  const stageToStatusMap = {
    "Cutting & Polishing": "POLISHED",   // 对应智能合约中的 POLISHED
    "Laser Engraving": "GRADED",         // 对应智能合约中的 GRADED
    "Enter Market": "IN_STOCK",          // 对应智能合约中的 IN_STOCK
    "Designing & Inlaying": "DESIGNED",  // 对应智能合约中的 DESIGNED
    "Customer Purchasing": "SOLD",       // 对应智能合约中的 SOLD
  };

  // 映射数字状态为状态字符串
  const statusMap = {
    0: "MINED",
    1: "POLISHED",
    2: "GRADED",
    3: "IN_STOCK",
    4: "DESIGNED",
    5: "SOLD"
  };

  useEffect(() => {
    // 查找当前珠宝并设置状态
    const diamond = diamonds.find((diamond) => diamond.id === parseInt(id));

    if (diamond) {
      setJewelry(diamond);
    }
  }, [id, diamonds]);
  // console.log(" jewelry status:", jewelry.status);
  // 处理生命周期更新
  const handleLifecycleUpdate = async (stage) => {
    try {
      const contract = await getContract();
      const signer = contract.signer;

      let tx;
      const currentTime = new Date().toISOString();
      console.log("Before transaction, jewelry status:", jewelry.status);
      // 更新珠宝的生命周期状态
      setJewelry((prevJewelry) => {
        const updatedJewelry = { ...prevJewelry, currentStage: stage, timestamp: currentTime };

        // 根据阶段更新时间戳并执行合约操作
        switch (stage) {
          case "Cutting & Polishing":
            tx = contract.updateStatusToPolished(jewelry.id, { from: signer.address });
            break;
          case "Laser Engraving":
            tx = contract.updateStatusToGraded(jewelry.id, { from: signer.address });
            break;
          case "Enter Market":
            tx = contract.updateStatusToInStock(jewelry.id, { from: signer.address });
            break;
          case "Designing & Inlaying":
            tx = contract.updateStatusToDesigned(jewelry.id, { from: signer.address });
            break;
          case "Customer Purchasing":
            tx = contract.updateStatusToSold(jewelry.id, { from: signer.address });
            break;
          default:
            break;
        }

        // 执行合约交易并更新珠宝状态
        if (tx && tx.wait) {
          tx.wait().then(() => {
            const updatedDiamonds = diamonds.map((diamond) =>
              diamond.id === prevJewelry.id ? updatedJewelry : diamond
            );
         
      console.log("After transaction, updated jewelry status:", updatedJewelry.status);

            setDiamonds(updatedDiamonds);
            message.success(`Successfully updated to: ${stage}`);
          }).catch((err) => {
            message.error(`Error while waiting for transaction: ${err.message}`);
          });
        }

        return updatedJewelry;
      });
    } catch (error) {
      message.error(`Failed to update lifecycle stage: ${stage}`);
    }
  };

  // 获取生命周期阶段的状态类
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

  // 显示生命周期详情
  const displayLifecycleDetails = (jewelry) => {
    const stages = [
      { stage: "Polished", timestamp: jewelry.cuttingTimestamp },
      { stage: "GRADED", timestamp: jewelry.engravingTimestamp },
      { stage: "IN_STOCK", timestamp: jewelry.inStockTimestamp }, // 新增阶段
      { stage: "DESIGNED", timestamp: jewelry.designTimestamp },
      { stage: "SOLD", timestamp: jewelry.purchasingTimestamp },
      { stage: "Transferred", timestamp: jewelry.ownershipTransferredTimestamp },
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
        <p><b>Current Stage:</b> {jewelry.currentStage}</p> {/* 显示状态字符串 */}
        <p><b>Grade:</b> {jewelry.grade}</p>
        <p><b>Last Updated:</b> {jewelry.timestamp}</p>
      </Card>

      {/* 显示生命周期详情 */}
      {displayLifecycleDetails(jewelry)}

      <div className="button-group">
        <Button 
          onClick={() => handleLifecycleUpdate("Cutting & Polishing")} 
          type="primary"
          disabled={jewelry.currentStage !== "MINED"} // 按钮仅在 MINED 阶段后启用
        >
          Cutting & Polishing
        </Button>
        <Button 
          onClick={() => handleLifecycleUpdate("Laser Engraving")} 
          type="primary"
          disabled={jewelry.currentStage !== "POLISHED"} // 按钮仅在 POLISHED 阶段后启用
        >
          Laser Engraving
        </Button>
        <Button 
          onClick={() => handleLifecycleUpdate("Enter Market")} 
          type="primary" 
          disabled={jewelry.currentStage !== "GRADED"} // 按钮仅在 GRADED 阶段后启用
        >
          Enter Market
        </Button>
        <Button 
          onClick={() => handleLifecycleUpdate("Designing & Inlaying")} 
          type="primary" 
          disabled={jewelry.currentStage !== "IN_STOCK"} // 按钮仅在 IN_STOCK 阶段后启用
        >
          Designing & Inlaying
        </Button>
        <Button 
          onClick={() => handleLifecycleUpdate("Customer Purchasing")} 
          type="primary" 
          disabled={jewelry.currentStage !== "DESIGNED"} // 按钮仅在 DESIGNED 阶段后启用
        >
          Customer Purchasing
        </Button>
        <Button 
          onClick={() => handleLifecycleUpdate("Ownership Transferred")} 
          type="primary" 
          disabled={jewelry.currentStage !== "SOLD"} // 按钮仅在 SOLD 阶段后启用
        >
          Ownership Transferred
        </Button>
      </div>
    </div>
  );
};

export default ProductInfo;
