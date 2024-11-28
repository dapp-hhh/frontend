import logo from './logo.svg';
import './App.css';
import Home from './components/home/home';
import CreateProduct from './components/createProduct/createProduct';
import ProductInfo from './components/productInfo/productinfo';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import  getContract  from "./contract";
import React, { useState,useEffect } from "react";




function App() {
  const [diamonds, setDiamonds] = useState([]);
  const statusMap = {
    0: "MINED",
    1: "POLISHED",
    2: "GRADED",
    3: "IN_STOCK",
    4: "DESIGNED",
    5: "SOLD"
  };
  useEffect(() => {
    const fetchJewelry = async () => {
      const contract = await getContract();
      const jewelryList = await contract.getAllJewelry();
      const formattedDiamonds = jewelryList.map((jewelry) => ({
        id: jewelry.id.toNumber(),
        name: jewelry.description,
        thumbnail: "https://via.placeholder.com/150",
        currentStage: statusMap[jewelry.status], // 使用映射表将状态转换为字符串
        grade: jewelry.certificate.grade || "N/A",
      }));
      setDiamonds(formattedDiamonds);
    };

    fetchJewelry().catch((err) => console.error("Failed to fetch jewelry:", err));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home diamonds={diamonds} />} />
        <Route path="/productinfo/:id" element={<ProductInfo diamonds={diamonds} setDiamonds={setDiamonds} />} />
        <Route path="/createProduct" element={<CreateProduct />} />
      </Routes>
    </Router>
  );
}

export default App;
