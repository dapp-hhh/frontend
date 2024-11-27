import logo from './logo.svg';
import './App.css';
import Home from './components/home/home';
import CreateProduct from './components/createProduct/createProduct';
import ProductInfo from './components/productInfo/productinfo';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import React, { useState } from "react";




function App() {
  const [diamonds, setDiamonds] = useState([
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
  ]);

  // 添加新产品的方法
  const addProduct = (newProduct) => {
    setDiamonds((prevDiamonds) => [...prevDiamonds, newProduct]);
  };



  

  return (
    <Router>
       
      <Routes>
        <Route path="/" element={<Home diamonds={diamonds} />} />
        <Route path="/productinfo/:id" element={<ProductInfo diamonds={diamonds} setDiamonds={setDiamonds} />} />
        <Route path="/createProduct" element={<CreateProduct addProduct={addProduct} />} />
      </Routes>
    </Router>
  );
}

export default App;
