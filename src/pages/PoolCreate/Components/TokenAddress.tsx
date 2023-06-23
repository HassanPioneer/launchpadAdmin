import React, {useEffect, useState} from 'react';
import {getTokenInfo} from "../../../utils/token";
import {CircularProgress, Tooltip, Button} from "@material-ui/core";
import useStyles from "../style";
import {debounce} from "lodash";
import {renderErrorCreatePool} from "../../../utils/validate";
import {useDispatch, useSelector} from "react-redux";
import {CHAIN_ID_NAME_MAPPING} from "../../../constants";
import { alertFailure, alertSuccess } from "../../../store/actions/alert";
import { getPoolContract } from "../../../services/web3";
import { updateDeploySuccess } from "../../../request/pool";

function TokenAddress(props: any) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { currentNetworkId } = useSelector((state: any) => state).userCurrentNetwork;
  const [loadingToken, setLoadingToken] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const { data: loginUser } = useSelector((state: any) => state.user);
  const {
    register, setValue, errors, watch, getValues, needValidate,
    poolDetail,
    token, setToken,
  } = props;
  const renderError = renderErrorCreatePool;
  const networkAvailable = watch('networkAvailable');
  const isDeployed = !!poolDetail?.is_deploy;

  useEffect(() => {
    if (poolDetail && poolDetail.token) {
      // First load when poolDetail change
      setValue('token', poolDetail.token, { shouldValidate: true });
      loadingTokenData(poolDetail.token);
    }
  }, [poolDetail]);

  useEffect(() => {
    if (poolDetail && networkAvailable) {
      // Auto load token when:
      // 1. Change network in Metamask
      // 2. Change select Network Available (Pool)
      const tokenAddressInputed = getValues('token');
      setValue('token', tokenAddressInputed, { shouldValidate: true });
      loadingTokenData(tokenAddressInputed);
    }
  }, [networkAvailable, currentNetworkId]);

  const loadingTokenData = async (tokenValue: string) => {
    try {
      setToken(null);
      setLoadingToken(true);

      const tokenAddress = tokenValue;
      const erc20Token = await getTokenInfo(tokenAddress);
      if (erc20Token) {
        const { name, symbol, decimals, address } = erc20Token;
        setLoadingToken(false);
        setToken({
          name,
          symbol,
          decimals,
          address
        });
      }
    } catch (err) {
      setLoadingToken(false);
    };
  };

  const handleTokenGetInfo = debounce(async (e: any) => {
    await loadingTokenData(e.target.value);
  }, 500);

  const changeEditForm = async (value: boolean) => {
    setEditForm(value)
  }

  const changeTokenSale = async () => {
    try {
      if (!loginUser || !loginUser.wallet_address) {
        console.log('login user null')
        return
      }

      if (!poolDetail || !poolDetail.network_available || !poolDetail.campaign_hash) {
        console.log('pool detail null')
        return
      }

      if (poolDetail.network_available !== poolDetail.network_claim && !poolDetail.campaign_claim_hash) {
        console.log('claim pool is not deployed yet')
        return
      }

      let poolAddress = poolDetail.campaign_hash
      let poolNetwork = poolDetail.network_available
      if (poolDetail.network_available !== poolDetail.network_claim) {
        poolAddress = poolDetail.campaign_claim_hash
        poolNetwork = poolDetail.network_claim
      }

      const newTokenAddress = getValues('token')
      const contractInstance = await getPoolContract({
        networkAvailable: poolNetwork,
        poolHash: poolAddress,
        isClaimable: true
      })

      if (!contractInstance) {
        console.log('contract instance null')
        return
      }

      const tx = await contractInstance.methods.changeSaleToken(newTokenAddress).send({ from: loginUser.wallet_address });
      if (!tx || !tx.events || !tx.events.TokenChanged) {
        console.log('tx failed', tx)
        dispatch(alertFailure(`Change Token sale blockchain error`))
        return
      }

      // save to backend
      const updateData = {
        campaign_hash: poolDetail.campaign_hash,
        token_symbol: token.symbol,
        token_name: token.name,
        token_decimals: token.decimals,
        token_address: token.address,
      };

      await updateDeploySuccess(updateData, poolDetail.id)
        .then(() => {
          dispatch(alertSuccess(`Change Token sale successfully`))
        }).catch(() => {
          dispatch(alertFailure(`Change Token sale backend error`))
        });
    }
    catch (e: any) {
      dispatch(alertFailure(`Change Token sale error: ${e.message}`))
    }
  }

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Token address</label>
        {isDeployed && !editForm &&
          <Button
            variant="contained"
            color="primary"
            onClick={() => changeEditForm(true)}
            style={{ marginLeft: 10, marginBottom: 10, float: 'right' }}
          >Edit Token</Button>
        }
        {isDeployed && editForm &&
          <Button
            variant="contained"
            color="primary"
            onClick={() => changeEditForm(false)}
            style={{ marginLeft: 10, marginBottom: 10, float: 'right' }}
          >Cancel</Button>
        }
        {isDeployed && editForm && !loadingToken &&
          <Button
            variant="contained"
            color="primary"
            onClick={() => changeTokenSale()}
            style={{ marginLeft: 10, marginBottom: 10, float: 'right' }}
          >Change Token</Button>
        }
        <div className={classes.formControlInputLoading}>
          <input
            type="text"
            name="token"
            ref={register({
              // required: true,
              validate: {
                invalidToken: async (val: string) => {
                  try {
                    if (!needValidate) {
                      if (val) {
                        const erc20Token = await getTokenInfo(val);
                      }
                      return true;
                    }
                    const erc20Token = await getTokenInfo(val);
                    return erc20Token;
                  } catch (err: any) {
                    return err.message;
                  }
                },
              }
            })}
            maxLength={255}
            onChange={handleTokenGetInfo}
            className={classes.formControlInput}
            disabled={isDeployed && !editForm}
          />
          {
            loadingToken ?
              <div className={classes.circularProgress}>
                <CircularProgress size={25} />
              </div> : (
                errors['token'] && (errors['token'].type === 'tokenAlreadyUsed' || errors['token'].type === 'invalidToken') ? <img src="/images/icon_close.svg" className={classes.loadingTokenIcon} /> : (token && <img src="/images/icon_check.svg" className={classes.loadingTokenIcon} />
                ))
          }
        </div>
        <p className={`${classes.formErrorMessage}`}>
          {
            renderError(errors, 'token')
          }
        </p>

        {errors?.token?.type &&
          <>
            <p className={`${classes.formErrorMessage}`}>
              You should check corresponding token with network.
            </p>
            <p className={`${classes.formErrorMessage}`}>
              Network Available Selected: <span style={{textTransform: 'uppercase'}}>{networkAvailable}</span>
            </p>
            <p className={`${classes.formErrorMessage}`}>
              Metamask User Network: <span>{CHAIN_ID_NAME_MAPPING[currentNetworkId]} ({currentNetworkId})</span>
            </p>
          </>
        }
      </div>
      {
        token && (
          <div className={classes.tokenInfo}>
            <div className="tokenInfoBlock">
              <span className="tokenInfoLabel">Token</span>
              <div className="tokenInfoContent">
                <img src="/images/eth.svg" alt="erc20" />
                <Tooltip title={<p style={{ fontSize: 15 }}>{token.name}</p>}>
                  <p className="tokenInfoText wordBreak">{`${token.name}`}</p>
                </Tooltip>
              </div>
            </div>
            <div className="tokenInfoBlock">
              <span className="tokenInfoLabel">Token Symbol</span>
              <div className="tokenInfoContent">
                <Tooltip title={<p style={{ fontSize: 15 }}>{token.symbol}</p>}>
                  <p className="wordBreak">{`${token.symbol}`}</p>
                </Tooltip>
              </div>
            </div>
            <div className="tokenInfoBlock">
              <span className="tokenInfoLabel">Token Decimals</span>
              <div className="tokenInfoContent">
                {`${token.decimals}`}
              </div>
            </div>
          </div>
        )
      }
    </>
  );
}

export default TokenAddress;
