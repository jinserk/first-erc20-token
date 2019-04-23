import React, { useState, useEffect } from "react";
import { utils } from "ethers";

import './App.css';
import { useInterval } from './Hook';

function TransferETH(props) {
  const { context, setTxModal } = props;
  const provider = context.library;
  const signer = provider.getSigner(context.account);

  const [to, setTo] = useState("");
  const [amount, setAmount] = useState(0);
  const [gasPrice, setGasPrice] = useState("10");
  const [gasLimit, setGasLimit] = useState("21000");

  const handleSubmit = (evt) => {
    evt.preventDefault();

    let result = window.confirm(
      `You are making a transaction of:
        from : ${context.account}
        to : ${to}
        amount : ${amount} eth
        Gas-price: ${gasPrice} gwei
        Gas-limit: ${gasLimit} units

      Are you sure to go ahead?`
    );

    if (result) {
      let transaction = {
        to: to,
        gasPrice: utils.parseUnits(gasPrice, 9),
        gasLimit: utils.bigNumberify(gasLimit),
        value: utils.parseEther(amount),
        chainId: context.networkId
      };
      console.log(transaction);

      (async function(tx) {
        try {
          let resp = await signer.sendTransaction(tx);
          provider.once(resp.hash, receipt => {
            console.log(receipt);
            window.alert(`Transaction confirmed!`);
            setTxModal(false);
          });
        } catch (err) {
          console.error(err);
          window.alert(`Error occured!`);
        }
      })(transaction);
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
              <input type="text" value={amount} onChange={e => setAmount(e.target.value)} /> eth
            </td>
          </tr>
          <tr>
            <td className="inner-td" align="right">Gas Price:</td>
            <td className="inner-td">
              <input type="text" value={gasPrice} onChange={e => setGasPrice(e.target.value)} /> gwei
            </td>
          </tr>
          <tr>
            <td className="inner-td" align="right">Gas Limit:</td>
            <td className="inner-td">
              <input type="text" value={gasLimit} onChange={e => setGasLimit(e.target.value)} /> units
            </td>
          </tr>
          </tbody>
        </table>
        <input type="submit" value="Send" />
      </form>
    </div>
  );
}

export default function ETHInfo(props) {
  const { context } = props;

  const [ethBalance, setEthBalance] = useState(0);
  const [txModal, setTxModal] = useState(false);

  async function fetchBalance() {
    setEthBalance(
      utils.formatEther(
        await context.library.getBalance(context.account)
      )
    );
  }

  useEffect(() => {
    fetchBalance();
  }, [context, txModal]);

  useInterval(() => {
    fetchBalance();
  }, 5000);

  return (
    <div className="inner-table">
      <table className="inner-table" width="100%">
        <tbody>
          <tr>
            <td width="20%" className="inner-td">
              ETH
            </td>
            <td width="40%" className="inner-td">
              {ethBalance}
            </td>
            <td width="40%" className="inner-td">
              { txModal ? (
                <button onClick={() => setTxModal(false)}>
                  Cancel
                </button> )
                : (
                <button onClick={() => setTxModal(true)}>
                  Transfer
                </button> )
              }
            </td>
          </tr>
          { txModal && (
          <tr>
            <td className="inner-td" colSpan="3">
              <hr />
              <TransferETH context={context} setTxModal={p => setTxModal(p)} />
            </td>
          </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

