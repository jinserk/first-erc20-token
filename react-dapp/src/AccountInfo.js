import React from "react";
import ReactLoading from 'react-loading';
import { Contract } from "ethers";

import './App.css';
import ETHInfo from './ETHInfo';
import EUNTokenInfo from './EUNTokenInfo';
import { usePromise } from './Hook';
import { Contracts } from './ContractConfig';

const checkContracts = async (contracts, context) => {
  const signer = context.library.getSigner(context.account);

  for (let contract of contracts) {
    const { abi, address } = contract;
    contract.instance = new Contract(address, abi, signer);
    try {
      let v = await contract.instance.deployed();
      contract.deployed = v ? true : false;
    } catch (e) {
      contract.deployed = false;
      throw(e);
    }
  }
  return contracts;
};

export default function AccountInfo(props) {
  const { context } = props;

  const [loading, resolved, error] = usePromise(() => {
    return checkContracts(Contracts, context);
  }, [context]);

  console.log(loading, resolved, error);

  if (loading) return (
    <div className="App-table">
      <table width="500">
      <tbody>
        <tr>
          <td>
            <br />
            <center><ReactLoading type="spin" color="#000" /></center>
            <br />
          </td>
        </tr>
      </tbody>
      </table>
    </div>
  );

  const render = () => {
    if (error || !resolved) return null;
    const rendered = resolved.filter(contract => {
      return contract.deployed;
    }).map((contract, idx) => {
      return (
        <tr key={idx}>
          <td colSpan="3">
            <EUNTokenInfo context={context} contract={contract} />
          </td>
        </tr>
      );
    });
    return rendered;
  }

  return (
    <div className="App-table">
      <table width="500">
        <caption>Account: <b>{context.account}</b></caption>
        <thead>
          <tr>
            <th width="20%">Item</th>
            <th width="40%">Balance</th>
            <th width="40%">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="3">
              <ETHInfo context={context} />
            </td>
          </tr>
          { render() }
        </tbody>
      </table>
    </div>
  );
}

