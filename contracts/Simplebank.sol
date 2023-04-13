// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Simplebank {
    uint public numberofFunders;
    uint public numberofFunds;
    uint public minAmountForBid;
    uint public payForUploadProduct;
    uint public lastBid;
    address public owner;
    address public productOwner;
    address public lastFunder;
    mapping(address=> bool) private funders;
    mapping(address => Product[]) private ownerProducts; 
    mapping(uint => address) private lutFunders; 
    mapping(address => uint) private ownerProductCounter;
    struct Product {
    uint id;
    string name;
    uint startingPriceWei;
    string generalDescription;
    address funder;
    }
    mapping (address => Product) public products;
    uint private productCounter = 0;
    mapping(address => Product) private latestProducts;

    mapping(address => bool) private hasAddedProduct;




    constructor(){
        owner = msg.sender;
        minAmountForBid = 4000000000000000000;
        productOwner = 0x23B2721CCB602b1080CE57c6b724119dc9ccB278;
        payForUploadProduct = 1000000000000000000;
    }

    modifier onlyOwner(){
        require(msg.sender == owner, "Only owner can do this");
        _;
    }

    
    function transferOwnership(address newOwner) external onlyOwner{
        owner = newOwner;
    }

    function addFundsPlain() external payable{
        address funder = msg.sender;
        require(msg.value >= minAmountForBid, "Minimum pay is 4 ether");
        lastFunder = funder; // update last funder
        if(!funders[funder]){
            uint index = numberofFunders++;
            funders[funder] = true;
            lutFunders[index] = funder;
            
        }

    }

function addFunds() external payable {
    address funder = msg.sender;
    uint newFund = msg.value;
    // uint balance = address(this).balance;
    require(newFund >= minAmountForBid, "Minimum pay is 4 ether");
    // require(newFund > address(this).balance, "New fund should be more than the current balance in the contract");
    // if (balance >= newFund) {
    // revert("New fund should be more than the current balance innnnnn the contract");
    // }
    if (address(this).balance > newFund) {
        uint remainingBalance = address(this).balance - newFund;
        payable(lastFunder).transfer(remainingBalance);
    }
    lastFunder = funder; // update last funder
    if (!funders[funder]) {
        uint index = numberofFunders++;
        funders[funder] = true;
        lutFunders[index] = funder;
    }
    numberofFunds++;
    lastBid = newFund;
    if (numberofFunds == 3){
        // 95% to productOwner and 5% to owner
        uint productOwnerAmount = address(this).balance * 95 / 100;
        payable(productOwner).transfer(productOwnerAmount);
        payable(owner).transfer(address(this).balance);
        numberofFunds = 0;
    }

}

function payForUpload() external payable {
    address funder = msg.sender;
    uint newFund = msg.value;
    require(newFund == payForUploadProduct, "pay is 1 ether");
    lastFunder = funder; // update last funder
    if (!funders[funder]) {
        uint index = numberofFunders++;
        funders[funder] = true;
        lutFunders[index] = funder;
    }
    
    address payable contractOwner = payable(owner);
    contractOwner.transfer(msg.value);
    }



    function getAllFunders() external view returns(address[] memory) {
        address[] memory _funders = new address[](numberofFunders);
        for(uint i=0; i<numberofFunders; i++){
            _funders[i] = lutFunders[i];
        }
        return _funders;
    }
    function withdraw(uint withdrawAmount) external {
        require(withdrawAmount < 1000000000000000000 || msg.sender == owner, "You can't wits");
        payable (msg.sender).transfer(withdrawAmount);
    }

    function getLastFunder() external view returns (address) {
        return lastFunder;
    }
    
    function getProductOwner() external view returns (address) {
        return productOwner;
    }

    function getMinAmount() external view returns (uint) {
        return minAmountForBid;
    }

    function getNumberofFunds() external view returns (uint){
        return numberofFunds;
    }
    
    function withdrawTo(address payable recipient, uint amount) external onlyOwner {
    require(address(this).balance >= amount, "Insufficient balance in the contract");
    recipient.transfer(amount);
    }


    // function addNewProduct(string memory _name, uint _startingPriceWei, string memory _generalDescription, address _owner) public {
    // // require(products[msg.sender].id == 0, "Funder cannot add a new product if they already have one");
    // require(!hasAddedProduct[_owner], "Funder can only add a product once");
    // Product memory newProduct = Product(productCounter, _name, _startingPriceWei, _generalDescription, _owner);
    // ownerProducts[_owner].push(newProduct);
    // latestProducts[_owner] = newProduct;
    // ownerProductCounter[_owner]++;
    // lutFunders[productCounter] = _owner;
    // productCounter++;
    // hasAddedProduct[_owner] = true;
    // }

    function addNewProduct(string memory _name, uint _startingPriceWei, string memory _generalDescription, address _owner) public {
    require(!hasAddedProduct[_owner], "Funder can only add a product once");
    Product memory newProduct = Product(productCounter, _name, _startingPriceWei, _generalDescription, _owner);
    ownerProducts[_owner].push(newProduct);
    latestProducts[_owner] = newProduct;
    ownerProductCounter[_owner]++;
    lutFunders[productCounter] = _owner;
    productCounter++;
    hasAddedProduct[_owner] = true;

    // Update productOwner and minAmountForBid
    if (productCounter == 1) {
        // If this is the first product added, set productOwner and minAmountForBid to this product's details
        productOwner = _owner;
        minAmountForBid = _startingPriceWei;
        } else {
        // Check if this product's ID is lower than the previous lowest ID
            if (newProduct.id < ownerProducts[productOwner][0].id) {
            productOwner = _owner;
            minAmountForBid = _startingPriceWei;
                }
            }
    }



    function getAllProducts() external view returns (Product[] memory) {
        uint productCount = 0;
        for (uint i = 0; i < numberofFunders; i++) {
            address productOwner = lutFunders[i];
            if (ownerProductCounter[productOwner] > 0) {
                productCount++;
            }
        }
        Product[] memory allProducts = new Product[](productCount);
        uint productIndex = 0;
        for (uint i = 0; i < numberofFunders; i++) {
            address productOwner = lutFunders[i];
            if (ownerProductCounter[productOwner] > 0) {
                allProducts[productIndex] = latestProducts[productOwner];
                productIndex++;
            }
        }
        return allProducts;
    }


    
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }


    function payContractOwner() public payable {
    require(msg.value == 1 ether, "Insufficient funds");
    address payable contractOwner = payable(owner);
    contractOwner.transfer(1 ether);
}

    
}





//const instance = await Simplebank.deployed()
// const funds = instance.funds()
// instance.addFunds({value:"4000000000000000000", from: accounts[0]})
// instance.addFunds({value:"500000000000000000", from: accounts[1]})
// instance.addFunds({value:"5000000000000000000", from: accounts[1]})
// instance.getAllFunders()
// instance.withdraw("1000000000000000000")
// instance.transferOwnership("0x469bC46515Ffed50e765b87DA3aEab4CAAf4F809")


// const recipient = "0x687591815BF3EeacF01FdE0aE993314259D607d9"; // replace with recipient address
// const amount = web3.utils.toWei("12", "ether"); // replace with amount to withdraw in ether
// await instance.withdrawTo(recipient, amount, { from: accounts[0] }); // replace with sender account

