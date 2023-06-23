import React from 'react';
import useStyles from "../style";
import {renderErrorCreatePool} from "../../../utils/validate";

function PoolMarketMakerIcon(props: any) {
  const classes = useStyles();
  const {
    register, errors,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Market Maker Icon</label>
        <input
          type="text"
          name='market_maker_icon'
          defaultValue={poolDetail?.market_maker_icon}
          ref={register({ })}
          className={classes.formControlInput}
        />

        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'market_maker_icon')
          }
        </p>
      </div>
    </>
  );
}

export default PoolMarketMakerIcon;
