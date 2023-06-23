import React, { useEffect } from "react";
import { renderErrorCreatePool } from "../../../utils/validate";
import useStyles from "../style";

function OnboardingProcess(props: any) {
  const styles = useStyles();
  const { register, setValue, errors, referenceLinks, disabled } = props;
  const renderError = renderErrorCreatePool;

  useEffect(() => {
    if (referenceLinks && referenceLinks.onboarding_process) {
      setValue("onboarding_process", referenceLinks.onboarding_process);
    }
  }, [referenceLinks]);
  
  const handleChangeFacebookLink = (e: any) => {
    setValue("onboarding_process", e.target.value);
  };

  return (
    <>
      <div className={styles.formControl}>
        <label className={styles.formControlLabel}>Onboarding Process: </label>
        <input
          type="text"
          name="onboarding_process"
          defaultValue={referenceLinks?.onboarding_process}
          ref={register({
            // required: true
          })}
          disabled={disabled}
          onChange={handleChangeFacebookLink}
          className={styles.formControlInput}
        />
        <p className={styles.formErrorMessage}>
          {renderError(errors, "onboarding_process")}
        </p>
      </div>
    </>
  );
}

export default OnboardingProcess;
