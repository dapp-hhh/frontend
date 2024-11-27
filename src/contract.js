import { ethers } from "ethers";
import JewelryLifecycleABI from "./JewelryLifecycleABI.json"; // 将ABI文件保存在src目录

// 合约地址
const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

// 创建合约实例
const getContract = () => {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return null;
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(contractAddress, JewelryLifecycleABI, signer);
};




export default getContract;
