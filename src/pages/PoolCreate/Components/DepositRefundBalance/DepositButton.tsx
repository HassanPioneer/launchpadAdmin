import React, { useEffect, useState } from 'react';
import useStyles from "../../style";
import { useDispatch, useSelector } from "react-redux";
import { getWeb3Instance, getErc20Contract } from "../../../../services/web3";
import { alertFailure, alertSuccess } from "../../../../store/actions/alert";
import { Button } from "@material-ui/core";
import {
  NATIVE_TOKEN_ADDRESS
} from "../../../../constants";

function DepositButton(props: any) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    poolDetail, rawDepositBalance, currencyAddress, disabled
  } = props;
  const { data: loginUser } = useSelector((state: any) => state.user);
  const [loading, setLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState<any>();
  const [disableButton, setDisableButton] = useState<Boolean>(false);

  const buyRemainTokens = async () => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Do you want buy deposit currency?')) {
      return false;
    }
    try {
      setLoading(true);
      setDisableButton(true)
      let hash

      if (currencyAddress == NATIVE_TOKEN_ADDRESS) {
        const web3 = getWeb3Instance()
        if (!web3) throw new Error('Fail to connect account')
        hash = await web3.eth.sendTransaction({ from: loginUser.wallet_address, to: poolDetail.campaign_hash, value: rawDepositBalance })
      } else {
        const ercContract = getErc20Contract({ networkAvailable: poolDetail.network_available, erc20TokenAddress: currencyAddress });
        if (!ercContract) throw new Error('Contract not found')
        hash = await ercContract.methods.transfer(poolDetail.campaign_hash, rawDepositBalance).send({
          from: loginUser.wallet_address
        });
      }
      setTransactionHash(hash.transactionHash);

      setLoading(false);
      dispatch(alertSuccess('Deposit Success !!!'));
    } catch (e) {
      setDisableButton(false)
      setLoading(false);
      dispatch(alertFailure('Deposit Fail !!!'));
      return false;
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={buyRemainTokens}
        disabled={disabled || disableButton}
      >Deposit Refunding Amount</Button>

      {loading &&
        (<div>Loading....</div>)
      }
      {transactionHash &&
        <div>
          Transaction Hash: {transactionHash}
        </div>
      }
    </>
  );
}

export default DepositButton;
