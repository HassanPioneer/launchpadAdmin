import React, {useEffect, useState} from 'react';
import useStyles from "../style";
import {Checkbox} from "@material-ui/core";
import {renderErrorCreatePool} from "../../../utils/validate";

function PoolRKPRate(props: any) {
  const classes = useStyles();
  const {
    register, errors, setValue, watch,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Launchpad Point Multiplier</label>
        <input
          type="number"
          name="point_rate"
          defaultValue={poolDetail?.point_rate}
          min={0}
          ref={register()}
          className={classes.formControlInput}
        />
        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'point_rate')
          }
        </p>
      </div>
    </>
  );
}

export default PoolRKPRate;
