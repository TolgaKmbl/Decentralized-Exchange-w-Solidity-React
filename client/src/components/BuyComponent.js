import React, { useState, useContext, useEffect } from 'react'
import tLogo from '../images/t-logo.png'
import ethLogo from '../images/eth-logo.png'

import { BuyContext } from '../App.js'

import "../App.css";
import 'bootstrap/dist/css/bootstrap.min.css';

function BuyComponent() {  

  const [output, setOutput] =  useState(0);
  const { ethBalance, tokenBalance, buyToken, web3 } = useContext(BuyContext);
  let ethInput = React.createRef();

    return (
        <form className="mb-3" onSubmit={(event) => {
            let etherAmount
            etherAmount = ((ethInput.current.value).toString())
            etherAmount = web3.utils.toWei(etherAmount, 'Ether')
            buyToken(etherAmount)            
          }}>
          <div>
            <label className="float-start text-muted"><b>Input</b></label>
            <span className="float-end text-muted">
              Balance: {web3.utils.fromWei(web3.utils.toBN(ethBalance),'Ether')}
            </span>
          </div>
          <div className="input-group mb-4">
            <input
              type="text"
              onChange={(event) => {
                const etherAmount = ethInput.current.value.toString()
                setOutput(etherAmount * 2470)
              }}
              ref={ethInput}
              className="form-control form-control-lg"
              placeholder="0"
              required />
            <div className="input-group-append">
              <div className="input-group-text">
                <img src={ethLogo} height='32' alt=""/>
                &nbsp;&nbsp;&nbsp; ETH
              </div>
            </div>
          </div>
          <div>
            <label className="float-start text-muted"><b>Output</b></label>
            <span className="float-end text-muted">
              Balance: {web3.utils.fromWei(web3.utils.toBN(tokenBalance),'Ether')}
            </span>
          </div>
          <div className="input-group mb-2">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="0"
              value={output}
              disabled
            />
            <div className="input-group-append">
              <div className="input-group-text">
                <img src={tLogo} height='32' alt=""/>
                &nbsp; TTT
              </div>
            </div>
          </div>
          <div className="mb-5">
            <span className="float-start text-muted">Exchange Rate</span>
            <span className="float-end text-muted">1 TTT = 0.0004048 ETH</span>
          </div>    
          <div className="d-grid">
            <button type="submit" className="btn btn-lg" id="swap-button"><b>Swap</b></button>
          </div>
        </form>
    )
}

export default BuyComponent
