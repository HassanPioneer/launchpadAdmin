import { Button } from "@material-ui/core";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { POOL_TYPE } from "../../../../constants";
import { getPoolContract } from "../../../../services/web3";
import { alertFailure, alertSuccess } from "../../../../store/actions/alert";
import useStyles from "../../style";
import React from 'react';

function WithdrawButton(props: any) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { poolDetail, currencyAddress, disabled } = props;
  const { data: loginUser } = useSelector((state: any) => state.user);
  const [loading, setLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState<any>();
  const [disableButton, setDisableButton] = useState<Boolean>(false);

  const withdrawRefundBalance = async () => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm("Do you want withdraw refund balance?")) {
      return false;
    }
    try {
      setLoading(true);
      setDisableButton(true);
      let hash;

      const poolContract = getPoolContract({
        networkAvailable: poolDetail.network_available,
        poolHash: poolDetail.campaign_hash,
        isClaimable: poolDetail.pool_type == POOL_TYPE.CLAIMABLE,
      });
      if (!loginUser?.wallet_address) return;
      const owner = await poolContract?.methods.owner().call();
      if (loginUser?.wallet_address !== owner) return;

      hash = await poolContract?.methods
        .refundRemainingCurrency(loginUser?.wallet_address, currencyAddress)
        .send({
          from: owner,
        });

      setTransactionHash(hash.transactionHash);

      setLoading(false);
      dispatch(alertSuccess("Withdraw Success !!!"));
    } catch (e) {
      setDisableButton(false);
      setLoading(false);
      dispatch(alertFailure("Withdraw Fail !!!"));
      return false;
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={withdrawRefundBalance}
        disabled={disabled || disableButton}
      >
        Withdraw All Refunding Amount
      </Button>

      {loading && <div>Loading....</div>}
      {transactionHash && <div>Transaction Hash: {transactionHash}</div>}
    </>
  );
}

export default WithdrawButton;
