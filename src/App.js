
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
  const [msgForFee, setMsgForFee] = useState(null)
  const [lastFunder, setLastFunder] = useState(null)
  const [productOwner, setProductOwner] = useState(null)
  const [minAmount, setMinAmount] = useState(null)
  const [numberofFunds, setNumberofFunds] = useState(null)
  const [products, setProducts] = useState([]);

  



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
    const loadProductOwner = async () => {
      const { contract } = web3Api;
      const ProductOwner = await contract.getProductOwner();
      setProductOwner(ProductOwner);
      console.log(productOwner)
    };
    web3Api.contract && loadProductOwner();
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
  // console.log(deposit)
  console.log(balance)
  if (Number(deposit)< 4){
    setMsgForBuyer("The bid must be higher than 4 etr and should be higher than the current bid ")
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
  const loadMinAmount = async () => {
    const { contract,web3 } = web3Api;
    const minAmount = await contract.getMinAmount();
    setMinAmount(web3.utils.fromWei(minAmount, "ether"));
    console.log(minAmount)
  };
  web3Api.contract && loadMinAmount();
}, [web3Api]);

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
  const getAccount = async () => {
    const accounts = await web3Api.web3.eth.getAccounts()
    setAccount(accounts[0])
  }
  web3Api.web3 && getAccount()
  },[web3Api.web3])


  async function submitProduct() {
    try {
      await web3Api.contract.addNewProduct(
        productName,
        web3Api.web3.utils.toWei(startingPrice, 'ether'),
        generalDescription,
        account
      );
    } catch (err) {
      setMsgForBuyer("you already added a product for sale");
      return;
    }
  
    // If the product was added successfully, clear the input fields and show a success message
    setProductName('');
    setStartingPrice('');
    setGeneralDescription('');
    setMsgForBuyer('Product added successfully!');
  }
  
  // const submitProduct = async () => {
  //   await addProduct();
  // };



  // const addProduct = async () => {
  //   const { contract, web3 } = web3Api;
  //   const startingPriceWei = startingPrice;
  //   await contract.addNewProduct(productName, startingPriceWei, generalDescription, account, {
  //     from: account,
  //   });
  // };

  const payFee = async () => {
    const {contract,web3} = web3Api
    await contract.payForUpload({
      from:account,
      value:web3.utils.toWei("1","ether")
    })
    setMsgForFee("The Fee has been payed")
    document.getElementById("myBtn").disabled = true;
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
    <div className="App">
      <div> Current Balance is {balance} Ether </div>
      <div> Your account is {account} </div>
      <br></br>
      <div> Your account balance is {accountBalance} </div>
      <br></br>

      <br></br>
      <div>the id you r bidding for is {productID}</div>
      <div>the product owner  is {productOwner}</div>
      <div>its starting price is {minAmount} ethr</div>
      <br></br>
      <div> Current biding price is {balance} </div>
      <div>The currend bid is {numberofFunds}/3</div>
      <br></br>
      <div>
        <input onChange={handelDeposit} />
        <button onClick={submitBed}> submitBed </button>
      </div>
      <br></br>
      <div>{msgForBuyer} </div>
      <div>the last funder is {lastFunder} </div>
      <br></br>
      <br></br>
      <br></br>
      <div>
        <input onChange={handelWithdrawAmount} />
        <button onClick={withDraw}> Withdraw funds </button>
      </div>
      <br></br>
      <div> To upload a new product for auction fill in this fields: 
        <br></br><br></br>
        
        Product name <input type="text" value={productName} onChange={handleProductName} /><br></br>
        Starting price <input type="text" value={startingPrice} onChange={handleStartingPrice} /><br></br>
        General description <textarea value={generalDescription} onChange={handleGeneralDescription}></textarea><br></br>
        <button onClick={submitProduct}> submitProduct </button>
      </div>
      {/* {msgForBuyer && <p>{msgForBuyer}</p>} */}
      <br></br><br></br>
      <div>NOTICE!!</div>
      <div>If you have not yet participated in an auction - you will have to pay a fee of 1 EHTER in order to put a product up for sale </div>
      <button id ="myBtn" onClick={payFee}> Press here to pay fee </button>
      <br></br>
      <div >{msgForFee} </div>
      <br></br><br></br>
      <ProductsList products={products} onSelectProduct={handleSelectButton} /> 
    </div>
  );
  }

export default App;
