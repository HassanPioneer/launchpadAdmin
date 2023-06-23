import React, {useEffect, useState} from 'react';
import useStyles from "../style";
import {renderErrorCreatePool} from "../../../utils/validate";

function PoolMarketMaker(props: any) {
  const classes = useStyles();
  const {
    register, errors,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;
  // const isDeployed = !!poolDetail?.is_deploy;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Market Maker</label>
        <input
          type="text"
          name="market_maker"
          defaultValue={poolDetail?.market_maker}
          ref={register({ })}
          maxLength={255}
          className={classes.formControlInput}
          // disabled={isDeployed}
        />
        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'market_maker')
          }
        </p>
      </div>
    </>
  );
}

export default PoolMarketMaker;
