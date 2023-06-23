import React, { useEffect, useState } from "react";
import useStyles from "../../style";
import {
  fieldMustBeGreaterThanZero,
  renderErrorCreatePool,
} from "../../../../utils/validate";
import FormControl from "@material-ui/core/FormControl";
import CurrencyInput from "react-currency-input-field";

function TokenSoldDisplay(props: any) {
  const classes = useStyles();
  const { register, setValue, errors, watch, getValues, poolDetail } = props;
  const renderError = renderErrorCreatePool;

  const [totalSoldCoinDisplay, setTotalSoldCoinDisplay] = useState<string>("");

  useEffect(() => {
    if (poolDetail && poolDetail.token_sold_display) {
      setTotalSoldCoinDisplay(poolDetail.token_sold_display);
    }
  }, [poolDetail]);

  const handleChange = (value: any, name: any) => {
    setTotalSoldCoinDisplay(value);
    setValue("token_sold_display", value, { shouldValidate: true });
  };

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>
          Token Sold Display (Add More)
        </label>
        <br />
        <span style={{ color: "blue" }}>
          This field (if set), value will plus to Token Sold (get from Smart
          Contract)
        </span>
        <CurrencyInput
          id="token_sold_display"
          placeholder="Please enter a number"
          value={totalSoldCoinDisplay}
          decimalsLimit={2}
          onValueChange={handleChange}
          className={`${classes.formInputBox}`}
        />
        <input
          type="hidden"
          name="token_sold_display"
          value={totalSoldCoinDisplay || ""}
          ref={register({})}
        />
        {/* <input
          type="number"
          name="token_sold_display"
          defaultValue={poolDetail?.token_sold_display}
          ref={register({
            // required: true
          })}
          maxLength={255}
          className={classes.formControlInput}
        /> */}
        <p className={classes.formErrorMessage}>
          {renderError(errors, "token_sold_display")}
        </p>
      </div>
    </>
  );
}

export default TokenSoldDisplay;
