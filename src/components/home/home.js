import React from "react";
import { Card, Button, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import './home.css'
const { Meta } = Card;

const Home = () => {
  const navigate = useNavigate();

  // 模拟数据
  const diamonds = [
    {
      id: 1,
      name: "Brilliant Spark",
      thumbnail: "https://via.placeholder.com/150",
      currentStage: "Cutting & Polishing",
      grade: "VVS1",
    },
    {
      id: 2,
      name: "Radiant Lustre",
      thumbnail: "https://via.placeholder.com/150",
      currentStage: "Quality Control",
      grade: "VS2",
    },
    {
      id: 3,
      name: "Eternal Shine",
      thumbnail: "https://via.placeholder.com/150",
      currentStage: "In Possession",
      grade: "IF",
    },
    {
      id: 4,
      name: "Timeless Glow",
      thumbnail: "https://via.placeholder.com/150",
      currentStage: "Customer Ownership",
      grade: "SI1",
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Luxury Diamonds</h1>
      <Row gutter={[16, 16]}>
        {diamonds.map((diamond) => (
          <Col xs={24} sm={12} md={8} lg={6} key={diamond.id}>
            <Card
              hoverable
              cover={
                <img
                  alt={`${diamond.name} thumbnail`}
                  src={diamond.thumbnail}
                  style={{ height: "150px", objectFit: "cover" }}
                />
              }
              onClick={() => navigate(`/productinfo/${diamond.id}`)}
            >
              <Meta
                title={diamond.name}
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
      <Button
        type="primary"
        style={{ marginTop: "20px" }}
        onClick={() => navigate("/createProduct")}
      >
        Create Product
      </Button>
    </div>
  );
};

export default Home;

