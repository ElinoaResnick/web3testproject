
import './App.css';
import { useState } from 'react';
import { useEffect } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { loadContract } from './utils/load-contract';
import Web3 from 'web3';
import ProductsList from './ProductsList';

function App() {
  const [web3Api, setWeb3Api] = useState({
  provider:null,
  web3:null,
  contract:null
  });

  const [balance, setBalance] = useState(null)
  const [accountBalance, setAccountBalance] = useState(null)
  const [account, setAccount] = useState(null)
  const [deposit, setDeposit] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [productID, setProductID] = useState('')
  const [productName, setProductName] = useState('')
  const [startingPrice, setStartingPrice] = useState('')
  const [generalDescription, setGeneralDescription] = useState('')
  const [msgForBuyer, setMsgForBuyer] = useState(null)
  const [msgForUploader, setMsgForUploader] = useState(null)
  const [msgForFee, setMsgForFee] = useState(null)
  const [lastFunder, setLastFunder] = useState(null)
  const [productOwner, setProductOwner] = useState(null)
  const [minAmount, setMinAmount] = useState(null)
  const [lowestProductID, setLowestProductID] = useState(null)
  const [numberofFunds, setNumberofFunds] = useState(null)
  const [products, setProducts] = useState([]);
  const [minAmountForBid, setMinAmountForBid] = useState(null)
  const [className, setClassName] = useState('button');
  // const logo = require("C:/Users/Elinoa Resnick/Desktop/Tech/web3testproject/src/logo.jpeg");
  // const headImg = require('./auction.jpeg');
  const handleMinAmountChange = (minAmount) => {
    setMinAmount(minAmount);
  };
  


function handelDeposit(e){
  setDeposit(e.target.value)
}

function handelWithdrawAmount(e){
  setWithdrawAmount(e.target.value)
}
function handelProductID(e){
  setProductID(e.target.value)
}

function handleProductName(e){
  setProductName(e.target.value)
}

function handleStartingPrice(e){
  setStartingPrice(e.target.value)
}
function handleGeneralDescription(e){
  setGeneralDescription(e.target.value)
}

function handleSelectButton (product) {
  setProductID(product.id);
  // setProductName(product.name);
  // setStartingPrice(product.startingPrice);
  // setGeneralDescription(product.generalDescription);
}


useEffect(()=>{
  const loadProvider = async () => {
    const provider = await detectEthereumProvider()
    const contract = await loadContract("Simplebank", provider)

    if(provider){
      setWeb3Api(
        {
          provider: provider,
          web3: new Web3(provider),
          contract:contract
        }
      )
    }
    else {
      console.log("Pleas install MetaMask")
    }
}

loadProvider()
  },[])

  useEffect(() => {
    const loadLastFunder = async () => {
      const { contract } = web3Api;
      const lastFunder = await contract.getLastFunder();
      setLastFunder(lastFunder);
      console.log(lastFunder)
    };
    web3Api.contract && loadLastFunder();
  }, [web3Api]);
 

  
  useEffect(() => {
    const loadNumberofFunds = async () => {
      const { contract } = web3Api;
      const numberofFunds = await contract.getNumberofFunds();
      setNumberofFunds(Number(numberofFunds));
      console.log(numberofFunds)
    };
    web3Api.contract && loadNumberofFunds();
  }, [web3Api]);

  useEffect(() => {
    const loadProducts = async () => {
      const { contract } = web3Api;
      const products = await contract.getAllProducts();
      setProducts(products);
    };
    web3Api.contract && loadProducts();
  }, [web3Api]);

const addFundsPlain = async () => {
  const {contract,web3} = web3Api
  await contract.addFundsPlain({
    from:account,
    value:web3.utils.toWei(deposit,"ether")
  })
}

const withDraw = async () => {
  const {contract,web3} = web3Api
  const withDrawAmount = web3.utils.toWei(withdrawAmount,"ether")
  await contract.withdraw(withDrawAmount, {from:account})
  console.log("rr")
}

const submitBed = async () => {
  console.log(deposit)
  console.log(balance)
  if (!products || products.length === 0) {
    console.log('No products available');
    return;
  }
  if (Number(deposit)< minAmount){
    setMsgForBuyer("The bid must be higher than the min amount for bid and should be higher than the current bid ")
  }
  else if(Number(deposit) > Number(balance)){
    const {contract,web3} = web3Api
    await contract.addFunds({
      from:account,
      value:web3.utils.toWei(deposit,"ether")
    })
    setMsgForBuyer("Congratulations! you are the highest bidder")
  }
  else{
    console.log("not good")
    setMsgForBuyer("Your bid is lower than the last bid, try spending some more money")
  }

}



useEffect(() => {
  const loadBalance = async () => {
    const {contract,web3} = web3Api
    const balance = await web3.eth.getBalance(contract.address)
    setBalance(web3.utils.fromWei(balance, "ether"))
  }
  web3Api.contract && loadBalance()
  },[web3Api])

  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api;
      const balance = await web3.eth.getBalance(account);
      setAccountBalance(web3.utils.fromWei(balance, "ether"));
    };
    web3Api.web3 && account && loadBalance();
  }, [web3Api, account]);
  


  useEffect(() => {
    const loadLowestProductID = async () => {
      const { contract } = web3Api;
      const lowestProductID = await contract.getLowestProductIDForSale();
      const lowestProductIDInt = lowestProductID.toNumber(); // convert BN to integer
      setLowestProductID(lowestProductIDInt);
    };
    web3Api.contract && loadLowestProductID();
  }, [web3Api]);
  

  useEffect(() => {
    const loadProductOwner = async () => {
      const { contract } = web3Api;
      const ProductOwner = await contract.getProductOwner();
      setProductOwner(ProductOwner);
      console.log(productOwner)
    };
    web3Api.contract && loadProductOwner();
  }, [web3Api]);

  
  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts()
      setAccount(accounts[0])
    }
    web3Api.web3 && getAccount()
    },[web3Api.web3])


  async function submitProduct() {
    try {
      const startingPriceEthr = startingPrice;
      await web3Api.contract.addNewProduct(
        productName,
        startingPriceEthr,
        generalDescription,
        account,
        {from:account,}
      );
    } catch (err) {
      setMsgForUploader("you already added a product for sale");
      return;
    }
  
    // If the product was added successfully, clear the input fields and show a success message
    setProductName('');
    setStartingPrice('');
    setGeneralDescription('');
    setMsgForUploader('Product added successfully!');
  }

  const payFee = async () => {
    const {contract, web3} = web3Api;
    try {
        await contract.payForUpload({
            from: account,
            value: web3.utils.toWei("1", "ether")
        });
        setMsgForFee("The Fee has been paid");
        document.getElementById("myBtn").disabled = true;
    } catch (error) {
        console.log(error);
        setMsgForFee("You already paid");
    }
};


  
  useEffect(() => {
    const getProducts = async () => {
      const { contract } = web3Api;
      const products = await contract.getAllProducts();
      console.log(products);
    };
    web3Api.contract && getProducts();
  }, [web3Api]);


  return (
    <div className="app">
        <div className="header">
        <div className="logo"><img src=".\logo.jpeg" alt="logo" width="350"></img></div>
        <div className="account">
          <h3> Account: {account}</h3>
          <h3> Balance: {accountBalance}</h3>
        </div>
      </div>
      {/* <div className="headImg"><img src={headImg} alt="headImg" width="300"></img></div> */}
      {/* <div> Current Balance is {balance} Ether </div> */}
      {/* <div className='det'>
      <div> Your account is {account} </div>
      <br></br>
      <div> Your account balance is {accountBalance} </div>
      </div> */}
      <br></br>
      <div className="auction">
      <h2>Let`s start auctioning!</h2>
      <div> Current biding price is {balance} </div>
      <div>The currend bid is {numberofFunds}/3</div>
      <br></br>
      <div>
        <input type="text" onChange={handelDeposit} placeholder= "Enter your bid amount" />
        <button
          onClick={submitBed}
          disabled={!products || products.length === 0}
          className={!products || products.length === 0 ? 'bb' : 'button'}
        >
          Submit Bid
        </button>

        {/* <button  className="button" onClick={submitBed} disabled={!products || products.length === 0}class="disabled" > submitBed </button> */}
      </div>
      {/* <br></br> */}
      <div>{msgForBuyer} </div>
        {/* <div>
          <input type="text" onChange={handelWithdrawAmount} />
          <button onClick={withDraw}> Withdraw funds </button>
        </div> */}
      <br></br>
      </div>
      <ProductsList products={products} onSelectProduct={handleSelectButton} setMinAmount={handleMinAmountChange}/> 
      <br></br>
      <div>the last funder is {lastFunder} </div>

      <br></br>
      <div className="upload">
        <h2>Upload product</h2>
      <div> To upload a new product for auction fill in this fields: 
        <br></br><br></br>
        <div className="upload1">
        <div className="upload11">Product name</div>
        <div className="upload12"><input type="text" value={productName} onChange={handleProductName} /></div><br></br>
        <div className="upload2">
        <div className="upload21">Starting price</div>
        <div className="upload22"><input type="text" value={startingPrice} onChange={handleStartingPrice} /></div><br></br>
        </div>
        <div className="upload3">
        <div className="upload31">General description</div>
        <div className="upload32"><textarea value={generalDescription} onChange={handleGeneralDescription}></textarea></div><br></br>
        </div>
        <button onClick={submitProduct}> submitProduct </button>
      </div>
      </div>
      {msgForUploader && <p>{msgForUploader}</p>}
      <br></br><br></br>
      <div>NOTICE!!</div>
      <div>If you have not yet participated in an auction - you will have to pay a fee of 1 EHTER in order to put a product up for sale </div>
      <button id ="myBtn" onClick={payFee}> Press here to pay fee </button>
      <br></br>
      <div >{msgForFee} </div>
      <br></br><br></br>
      {/* <div>min amount {minAmount}</div> */}
      </div>
    </div>
  );
  }

export default App;
