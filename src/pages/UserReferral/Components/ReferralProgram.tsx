import React, { useEffect } from "react";
import { renderErrorCreatePool } from "../../../utils/validate";
import useStyles from "../style";

function ReferralProgram(props: any) {
  const styles = useStyles();
  const { register, setValue, errors, referenceLinks, disabled } = props;
  const renderError = renderErrorCreatePool;

  useEffect(() => {
    if (referenceLinks && referenceLinks.referral_program) {
      setValue("referral_program", referenceLinks.referral_program);
    }
  }, [referenceLinks]);

  const handleChangeFacebookLink = (e: any) => {
    setValue("referral_program", e.target.value);
  };

  return (
    <>
      <div className={styles.formControl}>
        <label className={styles.formControlLabel}>Referral Program: </label>
        <input
          type="text"
          name="referral_program"
          defaultValue={referenceLinks?.referral_program}
          ref={register({
            // required: true
          })}
          disabled={disabled}
          onChange={handleChangeFacebookLink}
          className={styles.formControlInput}
        />
        <p className={styles.formErrorMessage}>
          {renderError(errors, "referral_program")}
        </p>
      </div>
    </>
  );
}

export default ReferralProgram;
