import React from "react";
import useStyles from "../../style";
import { renderErrorCreatePool } from "../../../../utils/validate";

function FacebookLink(props: any) {
  const classes = useStyles();
  const {
    register,
    setValue,
    errors,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;

  const handleChangeFacebookLink = (e: any) => {
    setValue("facebook_link", e.target.value);
  };

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Facebook Link</label>
        <input
          type="text"
          name="facebook_link"
          defaultValue={poolDetail?.socialNetworkSetting?.facebook_link}
          ref={register({
            // required: true
          })}
          onChange={handleChangeFacebookLink}
          className={classes.formControlInput}
        />
        <p className={classes.formErrorMessage}>
          {renderError(errors, "facebook_link")}
        </p>
      </div>
    </>
  );
}

export default FacebookLink;
