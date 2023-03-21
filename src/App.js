
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

function handelDeposit(e){
  setDeposit(e.target.value)
}

function handelWithdrawAmount(e){
  setWithdrawAmount(e.target.value)
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
  <div> Check that your account is {account} </div>
  <div>
    <input onChange={handelDeposit} />
    <button onClick={addFunds}> Add funds </button>
  </div>
  <div>
    <input onChange={handelWithdrawAmount} />
    <button onClick={withDraw}> Withdraw funds </button>
  </div>
  </div>
);
}

export default App;
