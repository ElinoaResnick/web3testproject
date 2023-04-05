// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Simplebank {
    uint public numberofFunders;
    uint public numberofFunds;
    uint public minAmountForBid;
    uint public lastBid;
    address public owner;
    address public productOwner;
    address public lastFunder;
    mapping(address=> bool) private funders;
    mapping(uint => address) private lutFunders;
    struct Product {
    uint id;
    string name;
    uint startingPriceWei;
    string generalDescription;
    }
    mapping (address => Product) public products;
    uint private productCounter = 0;



    constructor(){
        owner = msg.sender;
        minAmountForBid = 4000000000000000000;
        productOwner = 0x23B2721CCB602b1080CE57c6b724119dc9ccB278;
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
    // Product memory newProduct = Product(_name, _startingPriceWei, _generalDescription);
    // products[_owner] = newProduct;
    // }

    function addNewProduct(string memory _name, uint _startingPriceWei, string memory _generalDescription, address _owner) public {
    Product memory newProduct = Product(productCounter, _name, _startingPriceWei, _generalDescription);
    products[_owner] = newProduct;
    lutFunders[productCounter] = _owner;
    productCounter++;
    }

    // function getAllProducts() external view returns (Product[] memory) {
    //     uint productCount = 0;
    //     for (uint i = 0; i < numberofFunders; i++) {
    //         address productOwnerr = lutFunders[i];
    //         if (bytes(products[productOwnerr].name).length != 0) {
    //             productCount++;
    //         }
    //     }
    //     Product[] memory allProducts = new Product[](productCount);
    //     uint productIndex = 0;
    //     for (uint i = 0; i < numberofFunders; i++) {
    //     address productOwner = lutFunders[i];
    //     if (bytes(products[productOwner].name).length != 0) {
    //     allProducts[productIndex] = products[productOwner];
    //     productIndex++;
    // }
    // }

    //     return allProducts;
    //     }

    
    function getAllProducts() external view returns (Product[] memory) {
    uint productCount = 0;
    for (uint i = 0; i < productCounter; i++) {
        address productOwnerr = lutFunders[i];
        if (bytes(products[productOwnerr].name).length != 0) {
            productCount++;
        }
    }
    Product[] memory allProducts = new Product[](productCount);
    uint productIndex = 0;
    for (uint i = 0; i < productCounter; i++) {
        address productOwner = lutFunders[i];
        if (bytes(products[productOwner].name).length != 0) {
            allProducts[productIndex] = products[productOwner];
            productIndex++;
        }
    }
    return allProducts;
    }

    
    function getBalance() public view returns (uint256) {
        return address(this).balance;
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

