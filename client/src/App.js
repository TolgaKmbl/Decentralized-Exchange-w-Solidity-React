import React, { useState, useEffect } from "react";
import Token from "./contracts/Token.json";
import Swap from "./contracts/Swap.json";
import getWeb3 from "./getWeb3";

import Loading from "./components/Loading";
import BuyComponent from "./components/BuyComponent";
import SellComponent from "./components/SellComponent";
import Navbar from "./components/Navbar";

import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';

export const NavContext = React.createContext();
export const BuyContext = React.createContext();
export const SellContext = React.createContext();


function App() {  

  const [web3, setWeb3] =  useState(undefined);
  const [accounts, setAccounts] =  useState(undefined);

  const [swapContract, setSwap] =  useState(undefined);
  const [swapContractAdress, setSwapAdress] =  useState(undefined);
  const [tokenContract, setToken] =  useState(undefined); 

  const [tokenBalance, setTokenBalance] =  useState(0);   
  const [ethBalance, setEthBalance] =  useState(0);  

  const [isLoading, setIsLoading] =  useState(true); 
  const [isBuyOrSell, setIsBuyOrSell] =  useState('BUY');   

  useEffect(() => {    
    const init = async () => {
      try {
        const web3 = await getWeb3();
        setWeb3(web3);

        const accounts = await web3.eth.getAccounts(); 
        setAccounts(accounts[0]);  

        const networkId = await web3.eth.net.getId();

        const tokenNetwork = Token.networks[networkId];
        const tokenContract = new web3.eth.Contract(Token.abi, tokenNetwork.address); 
        setToken(tokenContract);

        const swapNetwork = Swap.networks[networkId];
        const swapContract = new web3.eth.Contract(Swap.abi, swapNetwork.address);
        setSwapAdress(swapNetwork.address);
        setSwap(swapContract);

        setIsLoading(false);
      } catch (error) {
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);        
      }
    }
    init();   
  }, []);


  useEffect(() => {
    const getEthBalance = async () => {
      const ethBalance = await web3.eth.getBalance(accounts);
      setEthBalance(ethBalance);
      const tokenBalance = await tokenContract.methods.balanceOf(accounts).call();
      setTokenBalance(tokenBalance);
    }
    if(typeof web3 !== 'undefined' && typeof accounts !== 'undefined' && typeof tokenContract !== 'undefined' && typeof swapContract !== 'undefined') {
      getEthBalance();          
    }    
  }, [ethBalance, tokenBalance, web3, accounts, tokenContract, swapContract])


  const buyToken = (etherAmount) => {
    setIsLoading(true);
    swapContract.methods.buyTokens().send({ value: etherAmount, from: accounts })
    .on('transactionHash', () => {
      window.location.reload();      
      setIsLoading(false);      
    })
  };

  const sellToken = (tokenAmount) => {
    setIsLoading(true);
    tokenContract.methods.approve(swapContractAdress, tokenAmount).send({ from: accounts }).on('transactionHash', () => {
      swapContract.methods.sellTokens(tokenAmount).send({ from: accounts })
      .on('transactionHash', () => {
        window.location.reload();
        setIsLoading(false);        
    })
    })
  };

  if(isLoading) {
    return <Loading />;
  }
  return (
    <div className="App">
      <div id="content" className="col-md-3 mt-5 mx-auto">
        <NavContext.Provider value={{accounts}}>
              <Navbar />
        </NavContext.Provider>
        <div className="d-flex justify-content-between mb-3" >
          <div>
            <button className="btn btn-secondary" aria-pressed="true" onClick={(event) => {
                setIsBuyOrSell('BUY')
              }}>BUY</button>
          </div>
          <span className="text-muted mt-1">&lt; &nbsp; &gt;</span>
          <div >
            <button className="btn btn-secondary" aria-pressed="false" onClick={(event) => {
                  setIsBuyOrSell('SELL')
                }}>SELL</button>
          </div>
        </div>
        <div className="card mb-6" id="card">
            <div className="card-body">
              {
              isBuyOrSell === 'BUY' ? 
              <BuyContext.Provider value={{ethBalance, tokenBalance, buyToken, web3}}>
                <BuyComponent />
              </BuyContext.Provider> 
              : 
              <SellContext.Provider value={{ethBalance, tokenBalance, sellToken, web3}}>
                <SellComponent />
              </SellContext.Provider>  
              }
            </div>
        </div>
      </div>
    </div>
  );

}

export default App;
