import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from "react-redux";
import useStyles from "../style";
import {useCommonStyle} from "../../../styles";
import {etherscanRoute} from "../../../utils";
import { getReadOnlyPoolContract, getPoolContract } from "../../../services/web3";
import { MAPPING_CHAINNAME_CHAINID } from "../../../constants";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import { alertFailure, alertSuccess } from "../../../store/actions/alert";

function PoolHash(props: any) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const commonStyle = useCommonStyle();
  const {
    poolDetail,
    duoNetworkPool,
    watch,
  } = props;

  const { data: loginUser } = useSelector((state: any) => state.user);
  const { currentNetworkId } = useSelector((state: any) => state).userCurrentNetwork;
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [poolInfo, setPoolInfo] = useState<any | null>(null);
  const [isWrongAddress, setIsWrongAddress] = useState<boolean>(false);

  const tokenAddressInputed = useMemo(() => watch("token"), [watch]);

  useEffect(() => {
    if (!tokenAddressInputed || !poolInfo?.tokenAddress) return;
    setIsWrongAddress(tokenAddressInputed.toLowerCase().trim() !== poolInfo?.tokenAddress.toLowerCase().trim())
  }, [watch, poolInfo?.tokenAddress, tokenAddressInputed]);

  const loadPoolInfo = async (poolAddress: string, poolNetwork: string) => {
    if (!poolAddress || !poolNetwork) {
      setPoolInfo(null)
      setLoadingInfo(false)
      return
    }
    try {
      setPoolInfo(null);
      setLoadingInfo(true);

      const poolInstance = await getReadOnlyPoolContract({
        networkAvailable: poolNetwork,
        poolHash: poolAddress,
        isClaimable: true
      })

      if (!poolInstance) {
        setPoolInfo(null);
        setLoadingInfo(false);
        return
      }

      const [tokenAddress, tokenSold] = await Promise.all([
        poolInstance.methods.token().call(),
        poolInstance.methods.tokenSold().call(),
      ]);

      let claimable, allowChangePurchasedState, newInterface
      try {
        [claimable, allowChangePurchasedState] = await Promise.all([
          poolInstance.methods.claimable().call(),
          poolInstance.methods.allowChangePurchasedState().call(),
        ]);
        newInterface = true
      } catch (err) {
        newInterface = false
        claimable = true
        allowChangePurchasedState = false
      }
      setLoadingInfo(false);
      setPoolInfo({
        newInterface,
        tokenAddress,
        tokenSold,
        claimable,
        allowChangePurchasedState
      });
    } catch (err) {
      setLoadingInfo(false);
    };
  };

  const toggleClaimableState = useCallback(async () => {
    try {
      const poolInstance = await getPoolContract({
        networkAvailable: poolDetail.network_available,
        poolHash: poolDetail.campaign_hash,
        isClaimable: true
      })

      const tx = await poolInstance?.methods.setClaimable(!poolInfo?.claimable).send({ from: loginUser.wallet_address });
      if (!tx) {
        console.log('tx failed', tx)
        return
      }

      dispatch(alertSuccess(`Toggle Claimable done`))
      loadPoolInfo(poolDetail.campaign_hash, poolDetail.network_available)
    } catch (err) {
      console.log('toggleClaimableState', err)
      dispatch(alertFailure(`Toggle Claimable error`))
    }
  }, [poolDetail, poolInfo, dispatch, loginUser])

  useEffect(() => {
    loadPoolInfo(poolDetail.campaign_hash, poolDetail.network_available)
  }, [poolDetail])

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>
          {
            duoNetworkPool ?
            `Pool Buying Address (Please deposit fake token for buying) - ${poolDetail?.network_available}` :
            `Pool Contract Address (Please deposit token to campaign smart contract address) - ${poolDetail?.network_available}`
          }

        </label>
        {/* {poolDetail?.campaign_hash && poolInfo?.newInterface &&
          <Button
            variant="contained"
            color="primary"
            onClick={toggleClaimableState}
            disabled={
              Number(MAPPING_CHAINNAME_CHAINID[poolDetail?.network_available]) !== Number(currentNetworkId) ||
              !poolDetail?.campaign_hash
            }
            style={{ marginLeft: 10, marginBottom: 10, float: 'right' }}
          >{poolInfo?.claimable ? 'Disable Claim' : 'Enable Claim'}</Button>
        } */}
        <div className={commonStyle.boldText}>
          {!!poolDetail?.is_deploy &&
            <Link href={etherscanRoute(poolDetail?.campaign_hash, poolDetail)} target={'_blank'}>
              {poolDetail?.campaign_hash}
            </Link>
          }
          {!poolDetail?.is_deploy && '--'}
        </div>
      {
        poolInfo && !loadingInfo && (
          <div className={classes.poolInfo}>
            <div className="poolInfoBlock">
              <span className="poolInfoLabel">Token (from contract)</span>
              <div className="poolInfoContent">
                <p className="poolInfoText wordBreak">{poolInfo?.tokenAddress}</p>
              </div>
            </div>
            <div className="poolInfoBlock">
              {/* <span className="poolInfoLabel">Claimable</span>
              <div className="poolInfoContent">
                <p className="poolInfoText wordBreak">{JSON.stringify(poolInfo?.claimable)}</p>
              </div> */}
            </div>
            <div className="poolInfoBlock">
              <span className="poolInfoLabel">Token sold (wei)</span>
              <div className="poolInfoContent">
                <p className="poolInfoText wordBreak">{poolInfo?.tokenSold}</p>
              </div>
            </div>
            {/* <div className="poolInfoBlock">
              <span className="poolInfoLabel">AllowChangePurchasedState</span>
              <div className="poolInfoContent">
                <p className="poolInfoText wordBreak">{JSON.stringify(poolInfo?.allowChangePurchasedState)}</p>
              </div>
            </div> */}
          </div>
        )
      }
      {
        isWrongAddress && !loadingInfo && (
          <div style={{color: "red"}}>
            The input token address does not match the token address from the contract.
          </div>
        )
      }
        {/*<input*/}
        {/*  type="text"*/}
        {/*  name="title"*/}
        {/*  defaultValue={poolDetail?.campaign_hash}*/}
        {/*  maxLength={255}*/}
        {/*  className={classes.formControlInput}*/}
        {/*  disabled*/}
        {/*/>*/}
      </div>
    </>
  );
}

export default PoolHash;
