import React from "react";
import { ACCEPT_CURRENCY } from "../../../constants";
import { useCommonStyle } from "../../../styles";
import useStyles from "../style";
import ExchangeRateDisplayPriceSwitch from "./ExchangeRateDisplayPriceSwitch";
import ExchangeRateETH from "./ExchangeRateETH";
import ExchangeRateUSDTDisplay from "./ExchangeRateUSDTDisplay";

function ExchangeRate(props: any) {
  const classes = useStyles();
  const commonStyle = useCommonStyle();
  const { register, setValue, errors, control, watch, poolDetail, token, needValidate } =
    props;

  const acceptCurrency = watch("acceptCurrency");

  return (
    <>
      {acceptCurrency == ACCEPT_CURRENCY.ETH && (
        <ExchangeRateDisplayPriceSwitch
          poolDetail={poolDetail}
          register={register}
          token={token}
          setValue={setValue}
          errors={errors}
          control={control}
          watch={watch}
        />
      )}

      <ExchangeRateETH
        poolDetail={poolDetail}
        register={register}
        token={token}
        setValue={setValue}
        errors={errors}
        control={control}
        watch={watch}
        needValidate={needValidate}
      />

      {acceptCurrency == ACCEPT_CURRENCY.ETH && (
        <ExchangeRateUSDTDisplay
          poolDetail={poolDetail}
          register={register}
          token={token}
          setValue={setValue}
          errors={errors}
          control={control}
          watch={watch}
        />
      )}
    </>
  );
}

export default ExchangeRate;
