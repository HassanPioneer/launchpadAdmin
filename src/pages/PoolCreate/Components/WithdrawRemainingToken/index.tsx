import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getPoolContract, getErc20Contract } from "../../../../services/web3";
import { alertFailure, alertSuccess } from "../../../../store/actions/alert";
import { Button } from "@material-ui/core";
import BigNumber from "bignumber.js";

function WithdrawRemainingToken(props: any) {
  const dispatch = useDispatch();
  const {
    poolDetail, disabled
  } = props;
  const { data: loginUser } = useSelector((state: any) => state.user);
  const [loading, setLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState<any>();
  const [disableButton, setDisableButton] = useState<Boolean>(false);

  useEffect(() => {
    const getBalance = async () => {
      const poolContract = getPoolContract({ networkAvailable: poolDetail.network_available, poolHash: poolDetail.campaign_hash, isClaimable: true })
      if (!poolContract) return

      const unclaimed = await poolContract.methods.totalUnclaimed().call()

      const tokenAddress = await poolContract.methods.token().call()
      const ercContract = getErc20Contract({ networkAvailable: poolDetail.network_available, erc20TokenAddress: tokenAddress });
      if (!ercContract) return

      const balance = await ercContract.methods.balanceOf(poolDetail.campaign_hash).call()

      if (BigNumber(unclaimed).gte(BigNumber(balance))) {
        setDisableButton(true)
      }
    }
    getBalance()
  }, [poolDetail]);

  const withdrawRemaining = async () => {
    // eslint-disable-next-line no-restricted-globals
    try {
      setLoading(true);
      setDisableButton(true)
      let hash

      const poolContract = getPoolContract({ networkAvailable: poolDetail.network_available, poolHash: poolDetail.campaign_hash, isClaimable: true })

      if (!poolContract) throw new Error('Contract not found')
      hash = await poolContract.methods.refundRemainingTokens(loginUser.wallet_address).send({
        from: loginUser.wallet_address
      });
      setTransactionHash(hash.transactionHash);

      setLoading(false);
      dispatch(alertSuccess('Withdraw Success !!!'));
    } catch (e) {
      console.log('withdrawRemaining', e)
      setDisableButton(false)
      setLoading(false);
      dispatch(alertFailure('Withdraw Fail !!!'));
      return false;
    }
  };

  return (
    <div style={{marginTop: 30}}>
      <Button
        variant="contained"
        color="primary"
        onClick={withdrawRemaining}
        disabled={disabled || disableButton}
      >Withdraw Remaining Token</Button>

      {loading &&
        (<div>Loading....</div>)
      }
      {transactionHash &&
        <div>
          Transaction Hash: {transactionHash}
        </div>
      }
    </div>
  );
}

export default WithdrawRemainingToken;
