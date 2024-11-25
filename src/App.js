import logo from './logo.svg';
import './App.css';
import Home from './components/home/home';
import CreateProduct from'./components/createProduct/createProduct';
import ProductInfo from'./components/productInfo/productinfo';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
          <Route path="/" element={<Home />} />  {/* 设置默认路由为 Home */}
          <Route path="/createProduct" element={<CreateProduct />} />
          <Route path="/productinfo/:id" element={<ProductInfo />} /> {/* 珠宝详情页 */}
          {/* 其他路由配置可以在这里添加 */}
        </Routes>
    </div>
    </Router>
  );
}

export default App;
