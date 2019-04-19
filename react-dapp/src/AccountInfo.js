import Promise from "promise";
import React, { useState, useEffect, useRef } from "react";
import { Contract } from "ethers";

import './App.css';
import ETHInfo from './ETHInfo';
import EUNTokenInfo from './EUNTokenInfo';

import { Contracts } from './ContractConfig';

function ListContracts(props) {
  const { context, contracts } = props;

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
          { contracts.current.map((c, i) => {
              if (c.deployed) {
                return (
                  <tr key={i}>
                    <td colSpan="3">
                      <EUNTokenInfo context={context} contract={c} />
                    </td>
                  </tr>
                );
              }
            })
          }
         </tbody>
      </table>
    </div>
  );
}

export default function AccountInfo(props) {
  const { context } = props;
  const contracts = useRef(Contracts);

  const checkContracts = async (cs) => {
    const promises = cs.current.map(async c => {
      const { abi, address } = c;
      c.instance = new Contract(address, abi, context.signer);
      try {
        await c.instance.deployed();
        c.deployed = true;
      } catch (e) {
        c.deployed = false;
        console.error(e);
      }
    });
    await Promise.all(promises);
    return cs;
  };

  const [state, setState] = useState(checkContracts(contracts));

  useEffect(() => {
    setState(checkContracts(contracts));
  }, [context.signer]);

  return <ListContracts context={context} contracts={contracts} />
}

