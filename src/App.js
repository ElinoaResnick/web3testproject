
import './App.css';
import { useState } from 'react';
import { useEffect } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { loadContract } from './utils/load-contract';
import Web3 from 'web3';


function App() {
  const [web3Api, setWeb3Api] = useState({
  provider:null,
  web3:null,
  contract:null
  })

  const [balance, setBalance] = useState(null)
  const [account, setAccount] = useState(null)
  const [deposit, setDeposit] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [productID, setProductID] = useState('')
  const [msgForBuyer, setMsgForBuyer] = useState(null)
  const [lastFunder, setLastFunder] = useState(null)


function handelDeposit(e){
  setDeposit(e.target.value)
}

function handelWithdrawAmount(e){
  setWithdrawAmount(e.target.value)
}
function handelProductID(e){
  setProductID(e.target.value)
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
  
  

const addFunds = async () => {
  const {contract,web3} = web3Api
  await contract.addFunds({
    from:account,
    value:web3.utils.toWei(deposit,"ether")
  })
}

const withDraw = async () => {
  const {contract,web3} = web3Api
  const withDrawAmount = web3.utils.toWei(withdrawAmount,"ether")
  await contract.withdraw(withDrawAmount, {from:account})
}

const submitBed = async () => {
  // console.log(deposit)
  // console.log(balance)
  if(Number(deposit) > Number(balance)){
    const {contract,web3} = web3Api
    await contract.addFunds({
      from:account,
      value:web3.utils.toWei(deposit,"ether")
    })
    setMsgForBuyer("Congratulations! you are thr highest bidder")
  }
  else{
    console.log("not good")
    setMsgForBuyer("Your bid is lower than the last bid, try spendingsome more money")
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
  const getAccount = async () => {
    const accounts = await web3Api.web3.eth.getAccounts()
    setAccount(accounts[0])
  }
  web3Api.web3 && getAccount()
  },[web3Api.web3])

return (
  <div className="App">
  <div> Current Balance is {balance} Ether </div>
  <div> Check that your account is {account} </div><br></br>
  <div> Current biding price is {balance} </div>
  <div>last date for biding is {}</div>
  <br></br>
  <div>
    <input onChange={handelDeposit} />
    <button onClick={addFunds}> Add funds </button>
  </div>
  <div>
    <input onChange={handelWithdrawAmount} />
    <button onClick={withDraw}> Withdraw funds </button>
  </div>
  <div>
    <input onChange={handelDeposit} />
    <button onClick={submitBed}> submitBed </button>
  </div>
  <div>{msgForBuyer} </div>
  <div>the last funder is {lastFunder} </div>

  </div>
);
}

export default App;
