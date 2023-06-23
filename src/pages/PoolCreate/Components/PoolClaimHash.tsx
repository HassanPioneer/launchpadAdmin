import React, { useCallback, useEffect, useState } from 'react';
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
    handlerDeployClaimPool
  } = props;

  const { data: loginUser } = useSelector((state: any) => state.user);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const { currentNetworkId } = useSelector((state: any) => state).userCurrentNetwork;
  const [poolInfo, setPoolInfo] = useState<any | null>(null);

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

      let claimable, allowChangePurchasedState
      try {
        [claimable, allowChangePurchasedState] = await Promise.all([
          poolInstance.methods.claimable().call(),
          poolInstance.methods.allowChangePurchasedState().call(),
        ]);
      } catch (err) {
        claimable = true
        allowChangePurchasedState = false
      }
      setLoadingInfo(false);
      setPoolInfo({
        tokenAddress,
        tokenSold,
        claimable,
        allowChangePurchasedState
      });
    } catch (err) {
      setLoadingInfo(false);
    };
  };
  
  const toggleAllowChangePurchasedStateState = useCallback(async () => {
    try {
      const poolInstance = await getPoolContract({
        networkAvailable: poolDetail.network_claim,
        poolHash: poolDetail.campaign_claim_hash,
        isClaimable: true
      })

      const tx = await poolInstance?.methods.setAllowChangePurchasedState(!poolInfo?.allowChangePurchasedState).send({ from: loginUser.wallet_address });
      if (!tx) {
        console.log('tx failed', tx)
        return
      }

      dispatch(alertSuccess(`Toggle AllowChangePurchasedStateState done`))
      loadPoolInfo(poolDetail.campaign_claim_hash, poolDetail.network_claim)
    } catch (err) {
      console.log('toggleAllowChangePurchasedStateState', err)
      dispatch(alertFailure(`Toggle AllowChangePurchasedStateState error`))
    }
  }, [poolDetail, poolInfo, dispatch, loginUser])

  useEffect(() => {
    loadPoolInfo(poolDetail.campaign_claim_hash, poolDetail.network_claim)
  }, [poolDetail])

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Pool Claiming Address (Please deposit real token for claiming) - {poolDetail?.network_claim}</label>

        {poolDetail?.campaign_claim_hash && poolInfo &&
          <Button
            variant="contained"
            color="primary"
            onClick={toggleAllowChangePurchasedStateState}
            disabled={
              Number(MAPPING_CHAINNAME_CHAINID[poolDetail?.network_claim]) !== Number(currentNetworkId) || 
              !poolDetail?.campaign_claim_hash
            }
            style={{ marginLeft: 10, marginBottom: 10, float: 'right' }}
          >{poolInfo?.allowChangePurchasedState ? 'Disable Set State' : 'Enable Set State'}</Button>
        }

        {!poolDetail?.campaign_claim_hash &&
          <Button
            variant="contained"
            color="primary"
            onClick={handlerDeployClaimPool}
            disabled={
              Number(MAPPING_CHAINNAME_CHAINID[poolDetail?.network_claim]) !== Number(currentNetworkId) || 
              !poolDetail?.campaign_hash
            }
            style={{ marginLeft: 10, marginBottom: 10, float: 'right' }}
          >Deploy</Button>
        }
        <div className={commonStyle.boldText}>
          {!!poolDetail?.campaign_claim_hash &&
            <Link href={etherscanRoute(poolDetail?.campaign_claim_hash, {network_available: poolDetail?.network_claim || poolDetail?.network_available})} target={'_blank'}>
              {poolDetail?.campaign_claim_hash}
            </Link>
          }
          {!poolDetail?.campaign_claim_hash && '--'}
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
                <span className="poolInfoLabel">Claimable</span>
                <div className="poolInfoContent">
                <p className="poolInfoText wordBreak">{JSON.stringify(poolInfo?.claimable)}</p>
                </div>
              </div>
              <div className="poolInfoBlock">
                <span className="poolInfoLabel">Token Sold (wei)</span>
                <div className="poolInfoContent">
                  <p className="poolInfoText wordBreak">{poolInfo?.tokenSold}</p>
                </div>
              </div>
              <div className="poolInfoBlock">
                <span className="poolInfoLabel">AllowChangePurchasedState</span>
                <div className="poolInfoContent">
                <p className="poolInfoText wordBreak">{JSON.stringify(poolInfo?.allowChangePurchasedState)}</p>
                </div>
              </div>
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
