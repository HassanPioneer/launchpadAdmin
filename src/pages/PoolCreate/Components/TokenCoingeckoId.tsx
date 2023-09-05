import React from 'react';
import useStyles from "../style";
import {renderErrorCreatePool} from "../../../utils/validate";

function TokenCoingeckoId(props: any) {
  const classes = useStyles();
  const {
    errors, register, poolDetail
  } = props;
  const renderError = renderErrorCreatePool;

  return (
    <>
      <div className={classes.formControl} style={{marginTop: 0}}>
        <label className={classes.formControlLabel}>
          {`Coingecko ID (https://www.coingecko.com/en/coins/coin-name => Find "API id" field in the Info section`}
        </label>
        <input
          type="text"
          name='coingeckoId'
          defaultValue={poolDetail?.coingecko_id}
          ref={register({ })}
          className={classes.formControlInput}
        />

        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'coingeckoId')
          }
        </p>
      </div>
    </>
  );
}

export default TokenCoingeckoId;
