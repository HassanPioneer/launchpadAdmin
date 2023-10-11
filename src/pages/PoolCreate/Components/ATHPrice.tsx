import React, { useEffect, useState } from "react";
import useStyles from "../style";
import FormControl from "@material-ui/core/FormControl";
// @ts-ignore
import CurrencyInput from "react-currency-input-field";

function ATHPrice(props: any) {
  const classes = useStyles();
  const { register, setValue, errors, poolDetail } = props;
  const [athPrice, setAthPrice] = useState("");

  useEffect(() => {
    if (poolDetail && poolDetail.total_sold_coin) {
      setAthPrice(poolDetail.ath_price);
    }
  }, [poolDetail]);

  const handleChange = (value: any, name: any) => {
    setAthPrice(value);
    setValue("athPrice", value, { shouldValidate: true });
  };

  return (
    <>
      <br />
      <FormControl component="fieldset">
        <label className={classes.formControlLabel}>ATH Price</label>
        <CurrencyInput
          id="athPrice"
          placeholder="Please enter a price"
          value={athPrice}
          decimalsLimit={2}
          onValueChange={handleChange}
          className={`${classes.formInputBox}`}
          // disabled={isDeployed}
        />    
        <input
          type="hidden"
          name="athPrice"
          value={athPrice || ""}
          ref={register({
            required: true,
          })}
        />
      </FormControl>
    </>
  );
}

export default ATHPrice;
