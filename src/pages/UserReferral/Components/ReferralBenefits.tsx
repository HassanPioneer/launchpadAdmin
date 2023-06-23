import React, { useEffect } from "react";
import { renderErrorCreatePool } from "../../../utils/validate";
import useStyles from "../style";

function ReferralBenefits(props: any) {
  const styles = useStyles();
  const { register, setValue, errors, referenceLinks, disabled } = props;
  const renderError = renderErrorCreatePool;

  useEffect(() => {
    if (referenceLinks && referenceLinks.benefit) {
      setValue("benefit", referenceLinks.benefit);
    }
  }, [referenceLinks]);

  const handleChangeFacebookLink = (e: any) => {
    setValue("benefit", e.target.value);
  };

  return (
    <>
      <div className={styles.formControl}>
        <label className={styles.formControlLabel}>
          Referral Program’s Benefits:{" "}
        </label>
        <input
          type="text"
          name="benefit"
          defaultValue={referenceLinks?.benefit}
          ref={register({
            // required: true
          })}
          disabled={disabled}
          onChange={handleChangeFacebookLink}
          className={styles.formControlInput}
        />
        <p className={styles.formErrorMessage}>
          {renderError(errors, "benefit")}
        </p>
      </div>
    </>
  );
}

export default ReferralBenefits;
