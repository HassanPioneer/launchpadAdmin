import React from 'react';
import useStyles from "../style";
import { renderErrorCreatePool } from "../../../utils/validate";

function ShortDescription(props: any) {
  const classes = useStyles();
  const {
    register, errors,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;
  const maxLength = 100;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Short description</label>
        <input
          type="text"
          name='short_description'
          defaultValue={poolDetail?.short_description}
          ref={register({ required: false, maxLength })}
          className={classes.formControlInput}
        />

        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'short_description', maxLength)
          }
        </p>
      </div>
    </>
  );
}

export default ShortDescription;
