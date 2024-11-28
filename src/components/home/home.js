import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import getContract from "../../contract";  // 引入获取合约的函数
import './home.css';

const { Meta } = Card;

const Home = () => {
  const [diamonds, setDiamonds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  

  useEffect(() => {
    
    const fetchDiamonds = async () => {
      try {
        const contract = getContract();
        if (!contract) {
            console.error("Contract instance is null.");
            return;
        }
        console.log("contract", contract);
    
        // 调用 `jewelryCount` 状态变量
        const diamondCount = await contract.jewelryCount();
        console.log("Jewelry Count:", diamondCount.toString());
    
        const diamondData = [];
        // 获取所有珠宝
        const allDiamonds = await contract.getAllJewelry();
        console.log("All Diamonds:", allDiamonds);
    
        // 遍历珠宝数据并构建前端显示数据
        allDiamonds.forEach((diamond, i) => {
            diamondData.push({
                id: diamond.id.toString(),
                description: diamond.description,
                currentStage: diamond.status,
                grade: diamond.certificate.CAId.toString(),
                thumbnail: `https://via.placeholder.com/150?text=Diamond+${diamond.id}`,
            });
        });
    
        setDiamonds(diamondData);
    } catch (error) {
        console.error("Error fetching diamonds:", error);
    } finally {
        setLoading(false);
    }
    
    };
    

    fetchDiamonds();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Luxury Diamonds</h1>
        <Row gutter={[16, 16]}>
          {diamonds.map((diamond) => (
            <Col xs={24} sm={12} md={12} lg={12} key={diamond.id}>
              <Card
                hoverable
                cover={<img alt={`${diamond.description} thumbnail`} src={diamond.thumbnail} style={{ height: "150px", objectFit: "cover" }} />}
                onClick={() => navigate(`/productinfo/${diamond.id}`)}
              >
                <Meta
                  title={diamond.description}
                  description={
                    <>
                      <p>ID: #{diamond.id}</p>
                      <p>Stage: {diamond.currentStage}</p>
                      <p>Grade: {diamond.grade}</p>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      
      <Button type="primary" style={{ marginTop: "20px" }} onClick={() => navigate("/createProduct")}>
        Create Product
      </Button>
    </div>
  );
};

export default Home;
