import React, { useState, useEffect } from "react";
import { utils } from "ethers";

import './App.css';
import { useInterval } from './Hook';

function TransferEUN(props) {
  const { context, contract, setTxModal } = props;
  const provider = context.library;

  const [to, setTo] = useState("");
  const [amount, setAmount] = useState(0);

  const handleSubmit = (evt) => {
    evt.preventDefault();

    let result = window.confirm(
      `You are making a transaction of:
        function : transfer
        from : ${context.account}
        to : ${to}
        amount : ${amount} EUN

        Are you sure to go ahead?`
    );

    if (result) {
      let value = utils.parseUnits(amount, contract.decimals);
      (async function(to, value) {
        try {
          let resp = await contract.instance.transfer(to, value);
          provider.once(resp.hash, receipt => {
            console.log(receipt);
            window.alert(`Transaction confirmed!`);
            setTxModal(false);
          });
        } catch (err) {
          console.error(err);
          window.alert(`Error occured!`);
        }
      })(to, value);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <table className="inner-table" width="100%">
          <tbody>
          <tr>
            <td className="inner-td" align="right">To:</td>
            <td className="inner-td">
              <input style={{ width: "380px" }} type="text" value={to} onChange={e => setTo(e.target.value)} />
            </td>
          </tr>
          <tr>
            <td className="inner-td" align="right">Amount:</td>
            <td className="inner-td">
              <input type="text" value={amount} onChange={e => setAmount(e.target.value)} /> EUN
            </td>
          </tr>
          </tbody>
        </table>
        <input type="submit" value="Send" />
      </form>
    </div>
  );
}

export default function EUNTokenInfo(props) {
  const { context, contract } = props;

  const [balance, setBalance] = useState("0");
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState(18);
  const [txModal, setTxModal] = useState(false);

  (async function getContractInfo() {
    try {
      setSymbol(await contract.instance.symbol());
      setDecimals(utils.bigNumberify(await contract.instance.decimals()).toNumber());
      contract.decimals = decimals;
    } catch (e) {
      console.log(e);
    }
  })();

  async function fetchBalance() {
    let balance = utils.bigNumberify(await contract.instance.balanceOf(context.account)).toString();
    setBalance(utils.formatUnits(balance, decimals));
  }
  fetchBalance();

  useInterval(() => {
    fetchBalance();
  }, 5000);

  return (
    <div className="inner-table">
      <table className="inner-table" width="100%">
        <tbody>
          <tr>
            <td width="20%" className="inner-td">
              {symbol}
            </td>
            <td width="40%" className="inner-td">
              {balance}
            </td>
            <td width="40%" className="inner-td">
              { txModal ? (
                <button onClick={() => setTxModal(false)}>
                  Cancel
                </button>
              ) : (
                <button onClick={() => setTxModal(true)}>
                  Transfer
                </button>
              )}
            </td>
          </tr>
          { txModal && (
          <tr>
            <td className="inner-td" colSpan="3">
              <hr />
              <TransferEUN context={context} contract={contract} setTxModal={p => setTxModal(p)}  />
            </td>
          </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

