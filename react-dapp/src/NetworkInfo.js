import React, { useState } from "react";
import { utils } from "ethers";

import './App.css';
import { useInterval } from "./Hook";

export default function NetworkInfo(props) {
  const { context } = props;

  const [blockNumber, setBlockNumber] = useState(0);
  const [gasPrice, setGasPrice] = useState("0");

  async function fetch() {
      setBlockNumber(await context.library.getBlockNumber());
      setGasPrice(utils.formatUnits(await context.library.getGasPrice(), 9));
  }
  fetch();

  useInterval(() => { fetch(); }, 5000);

  return (
    <div className="App-table">
      <table width="500">
      <caption>Network Info</caption>
        <thead>
        <tr>
          <th width="50%">Item</th>
          <th width="50%">Value</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>Network ID</td>
          <td>{context.networkId}</td>
        </tr>
        <tr>
          <td>Block Number</td>
          <td>{blockNumber}</td>
        </tr>
        <tr>
          <td>Gas Price</td>
          <td>{gasPrice} gwei</td>
        </tr>
        </tbody>
      </table>
    </div>
  );
}

