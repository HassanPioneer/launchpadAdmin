import React, {useState} from 'react';
import useStyles from "../style";
import {renderErrorCreatePool} from "../../../utils/validate";
import {useSelector} from "react-redux";
import {CHAIN_ID_NAME_MAPPING} from "../../../constants";

const DEFAULT_STAKING_POOL_ADDRESS = process.env.REACT_APP_STAKING_CONTRACT;

function PoolContractAddress(props: any) {
  const classes = useStyles();
  const { currentNetworkId } = useSelector((state: any) => state).userCurrentNetwork;
  const {
    register, errors,
    poolDetail,
    contractDetail,
    isEdit,
  } = props;
  const renderError = renderErrorCreatePool;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Pool Contract Address</label>
        <div className={classes.formControlInputLoading}>
          <input
            type="text"
            name='pool_address'
            ref={register({
              required: true,
              validate:  (val: string) => (val && (contractDetail?.allocRewardToken || contractDetail?.linearAcceptedToken) ) ? true : false
            })}
            defaultValue={isEdit ? poolDetail?.pool_address : DEFAULT_STAKING_POOL_ADDRESS}
            maxLength={255}
            className={classes.formControlInput}
            disabled={isEdit && poolDetail?.pool_address}
          />
        </div>
        <p className={`${classes.formErrorMessage}`}>
          {
            renderError(errors, 'pool_address')
          }
        </p>

        {!(contractDetail && (contractDetail?.allocRewardToken || contractDetail?.linearAcceptedToken)) &&
          <>
            <p className={`${classes.formErrorMessage}`}>
              Invalid Pool Contract Address
            </p>
            <p className={`${classes.formErrorMessage}`}>
              Metamask User Network: <span>{CHAIN_ID_NAME_MAPPING[currentNetworkId]} ({currentNetworkId})</span>
            </p>
          </>
        }
      </div>
      {
        contractDetail && (contractDetail?.allocRewardToken || contractDetail?.linearAcceptedToken) && (
          <div className={classes.tokenInfo} style={{flexDirection: 'column', alignItems: 'normal'}}>
            {
              contractDetail?.allocRewardToken && (
                <div className="tokenInfoContent">
                  <p className="tokenInfoText">Alloc Reward Token: {`${contractDetail?.allocRewardToken}`}</p>
                </div>
              )
            }
            {
              contractDetail?.linearAcceptedToken && (
                <div className="tokenInfoContent">
                  <p className="tokenInfoText">Linear Accepted Token: {`${contractDetail?.linearAcceptedToken}`}</p>
                </div>
              )
            }
          </div>
        )
      }
    </>
  );
}

export default PoolContractAddress;
