// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Simplebank {
    uint public numberofFunders;
    address public owner;
    mapping(address=> bool) private funders;
    mapping(uint => address) private lutFunders;

    constructor(){
        owner = msg.sender;
    }

    modifier onlyOwner(){
        require(msg.sender == owner, "Only owner can do this");
        _;
    }

    
    function transferOwnership(address newOwner) external onlyOwner{
        owner = newOwner;
    }

    function addFunds() external payable{
        address funder = msg.sender;
        if(!funders[funder]){
            uint index = numberofFunders++;
            funders[funder] = true;
            lutFunders[index] = funder;
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

}
//const instance = await Simplebank.deployed()
//const funds = instance.funds()
//instance.addFunds({value:"500000000000000000", from: accounts[0]})
//instance.addFunds({value:"500000000000000000", from: accounts[1]})
// instance.getAllFunders()
// instance.withdraw("1000000000000000000")
// instance.transferOwnership("0x469bC46515Ffed50e765b87DA3aEab4CAAf4F809")