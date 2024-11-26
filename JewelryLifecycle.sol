
//钻石完整生命流程：开采(Mining)，切割和抛光(Cutting)，分等级给id(Grading)，待制造(Making), 设计(Designing)，购买(Purching)，转让拥有权(Transfer),
//制造商给购买者颁发包含购买者信息及商品历史信息的CA,允许转让CA（再添加包含证书转移的历史信息）
//加一个数组类型jewelIds，存储已经存在的珠宝，用于每次触发操作判断是否有此物品
//添加一个展示珠宝生命流程的数据结构，ProcessLog存储珠宝经历的状态和时间戳
//限制只有奢侈品形态（最终阶段）的珠宝才能被用户买卖
//限制商品被购买的状态
//新增 Certificate 结构体(还不确定有效)




// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract JewelryLifecycle {

    address public miningCompany;
    address public cuttingCompany;
    address public gradingLab;
    address public jewelryMaker;

    enum Status { Mining, Cutting, Polishing, QualityControl, JewelryMaking, Purchased }

    struct Jewelry {
        uint256 id;                // 珠宝唯一ID
        uint256 CAId;              // 证书ID
        string description;        // 珠宝的描述
        address currentOwner;      // 当前所有者的地址
        Status status;             // 珠宝当前状态
        uint256 timestamp;         // 珠宝状态更新时间戳
    }

    struct ProcessLog {
        Status status;             // 状态
        uint256 timestamp;         // 状态变更时间戳
    }

    struct Certificate {
        uint256 CAId;          // 数字证书唯一ID
        address issuer;        // 证书颁发者（分级实验室）
        string metadata;       // 证书相关元数据（可包含IPFS哈希或明文描述）
        bool isValid;          // 证书是否有效
    }


    mapping(uint256 => Jewelry) public jewels;
    mapping(uint256 => ProcessLog[]) public jewelLogs; // 每个珠宝的流程日志
    mapping(uint256 => Certificate) public certificates;

    uint256[] public jewelIds; // 存储所有已创建珠宝的ID

    modifier onlyMiningCompany() {
        require(msg.sender == miningCompany, "Only mining company can perform this action");
        _;
    }

    modifier onlyCuttingCompany() {
        require(msg.sender == cuttingCompany, "Only cutting company can perform this action");
        _;
    }

    modifier onlyGradingLab() {
        require(msg.sender == gradingLab, "Only grading lab can perform this action");
        _;
    }

    modifier onlyJewelryMaker() {
        require(msg.sender == jewelryMaker, "Only jewelry maker can perform this action");
        _;
    }

    modifier onlyOwner(uint256 jewelId) {
        require(msg.sender == jewels[jewelId].currentOwner, "Only the current owner can perform this action");
        _;
    }

    constructor(address _miningCompany, address _cuttingCompany, address _gradingLab, address _jewelryMaker) {
        miningCompany = _miningCompany;
        cuttingCompany = _cuttingCompany;
        gradingLab = _gradingLab;
        jewelryMaker = _jewelryMaker;
    }

    // 检查珠宝是否存在
    function isJewelExist(uint256 jewelId) public view returns (bool) {
        for (uint256 i = 0; i < jewelIds.length; i++) {
            if (jewelIds[i] == jewelId) {
                return true;
            }
        }
        return false;
    }

    // 创建珠宝并存储其ID
    function createJewelry(uint256 jewelId, string memory description) public onlyMiningCompany {
        require(!isJewelExist(jewelId), "Jewelry already exists");
        jewels[jewelId] = Jewelry({
            id: jewelId,
            CAId: 0,  // 初始时没有CAId
            description: description,
            currentOwner: msg.sender,
            status: Status.Mining,
            timestamp: block.timestamp
        });
        jewelIds.push(jewelId); // 将珠宝ID添加到数组中
        jewelLogs[jewelId].push(ProcessLog(Status.Mining, block.timestamp)); // 记录创建阶段
    }



    // 更新珠宝状态为切割阶段
    function updateStatusCutting(uint256 jewelId) public onlyCuttingCompany {
        require(isJewelExist(jewelId), "Jewelry does not exist");
        require(jewels[jewelId].status == Status.Mining, "Jewelry must be in Mining stage");
        jewels[jewelId].status = Status.Cutting;
        jewels[jewelId].timestamp = block.timestamp;
        jewelLogs[jewelId].push(ProcessLog(Status.Cutting, block.timestamp)); // 记录状态变更
    }

    // 更新珠宝状态为质量检测阶段
    function updateStatusQualityControl(uint256 jewelId) public onlyGradingLab {
        require(isJewelExist(jewelId), "Jewelry does not exist");
        require(jewels[jewelId].status == Status.Cutting, "Jewelry must be in Cutting stage");
        jewels[jewelId].status = Status.QualityControl;
        jewels[jewelId].timestamp = block.timestamp;
        jewelLogs[jewelId].push(ProcessLog(Status.QualityControl, block.timestamp)); // 记录状态变更
    }

    // 更新珠宝状态为珠宝制作阶段
    function updateStatusJewelryMaking(uint256 jewelId) public onlyJewelryMaker {
        require(isJewelExist(jewelId), "Jewelry does not exist");
        require(jewels[jewelId].status == Status.QualityControl, "Jewelry must be in Quality Control stage");
        jewels[jewelId].status = Status.JewelryMaking;
        jewels[jewelId].timestamp = block.timestamp;
        jewelLogs[jewelId].push(ProcessLog(Status.JewelryMaking, block.timestamp)); // 记录状态变更
    }

    // 分级实验室生成数字证书
    function generateCertificate(uint256 jewelId, uint256 CAId, string memory metadata) public onlyGradingLab {
        require(isJewelExist(jewelId), "Jewelry does not exist");
        require(jewels[jewelId].CAId == 0, "CAId has already been assigned");

        // 创建证书并绑定到珠宝
        jewels[jewelId].CAId = CAId;
        certificates[CAId] = Certificate({
            CAId: CAId,
            issuer: msg.sender,
            metadata: metadata,
            isValid: true
        });

        jewels[jewelId].timestamp = block.timestamp;
        jewelLogs[jewelId].push(ProcessLog(jewels[jewelId].status, block.timestamp));
    }

    // 验证证书
    function verifyCertificate(uint256 CAId) public view returns (bool) {
        Certificate memory cert = certificates[CAId];
        return cert.isValid;
    }

    function getJewelryDetails(uint256 jewelId) public view returns (Jewelry memory, Certificate memory) {
        require(isJewelExist(jewelId), "Jewelry does not exist");
        Certificate memory cert = certificates[jewels[jewelId].CAId];
        return (jewels[jewelId], cert);
    }



    // 购买珠宝并转移所有权及CAId
    function purchaseJewelry(uint256 jewelId) public onlyOwner(jewelId) {
        require(isJewelExist(jewelId), "Diamond does not exist");
        require(jewels[jewelId].CAId == 1, "luxury have not done yet!");
        require(jewels[jewelId].status != Status.Purchased, "luxury have buyed by others!");
        jewels[jewelId].status = Status.Purchased;
        jewels[jewelId].currentOwner = msg.sender;
        jewels[jewelId].timestamp = block.timestamp;
        jewelLogs[jewelId].push(ProcessLog(Status.Purchased, block.timestamp)); // 记录购买阶段
    }

    // 获取珠宝的完整流程日志，返回的是abi编码格式，更适合与前端对接
    function getJewelLogs(uint256 jewelId) public view returns (ProcessLog[] memory) {
        require(isJewelExist(jewelId), "Jewelry does not exist");
        return jewelLogs[jewelId];
    }
}
