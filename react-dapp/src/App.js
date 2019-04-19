import React, { Fragment, useEffect } from "react";
import Web3Provider, { Connectors, useWeb3Context } from "web3-react";

import './App.css';
import { Web3Unavailable, AccountUnavailable } from "./Error";
import NetworkInfo from "./NetworkInfo";
import AccountInfo from "./AccountInfo";

const { InjectedConnector } = Connectors;
const MetaMask = new InjectedConnector();
const connectors = { MetaMask };

function MyComponent() {
  const context = useWeb3Context();
  const signer = context.library.getSigner(context.account);

  const myContext = {
    ...context,
    signer: signer
  }

  return (
    context.account ? (
      <Fragment>
        <NetworkInfo context={myContext}/>
        <br />
        <AccountInfo context={myContext} />
      </Fragment>
    ) : <AccountUnavailable />
  );
}

function MetaMaskComponent() {
  const context = useWeb3Context();

  useEffect(() => {
    if (!context.active)
      context.setConnector("MetaMask");
  }, [context.active]);

  return (context.active ? <MyComponent /> : <Web3Unavailable />);
}

export default function App() {
  return (
    <Web3Provider connectors={connectors} libraryName="ethers.js">
      <div className="App">
        <MetaMaskComponent />
      </div>
    </Web3Provider>
  );
}
