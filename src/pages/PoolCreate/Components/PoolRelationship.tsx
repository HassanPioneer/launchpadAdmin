import React from 'react';
import useStyles from "../style";
import {renderErrorCreatePool} from "../../../utils/validate";

function PoolRelationship(props: any) {
  const classes = useStyles();
  const {
    register, errors,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Relationship Type</label>
        <input
          type="text"
          name="relationship_type"
          defaultValue={poolDetail?.relationship_type}
          ref={register({ })}
          maxLength={255}
          className={classes.formControlInput}
        />
        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'relationship_type')
          }
        </p>
      </div>
    </>
  );
}

export default PoolRelationship;
