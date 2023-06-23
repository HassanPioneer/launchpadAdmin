import React, { useEffect } from "react";
import { renderErrorCreatePool } from "../../../utils/validate";
import useStyles from "../style";

function FullGuide(props: any) {
  const styles = useStyles();
  const { register, setValue, errors, referenceLinks, disabled } = props;
  const renderError = renderErrorCreatePool;

  useEffect(() => {
    if (referenceLinks && referenceLinks.full_guide) {
      setValue("full_guide", referenceLinks.full_guide);
    }
  }, [referenceLinks]);
  
  const handleChangeFacebookLink = (e: any) => {
    setValue("full_guide", e.target.value);
  };

  return (
    <>
      <div className={styles.formControl}>
        <label className={styles.formControlLabel}>Full Guide: </label>
        <input
          type="text"
          name="full_guide"
          defaultValue={referenceLinks?.full_guide}
          ref={register({
            // required: true
          })}
          disabled={disabled}
          onChange={handleChangeFacebookLink}
          className={styles.formControlInput}
        />
        <p className={styles.formErrorMessage}>
          {renderError(errors, "full_guide")}
        </p>
      </div>
    </>
  );
}

export default FullGuide;
