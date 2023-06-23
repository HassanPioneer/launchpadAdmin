import React from "react";
import useStyles from "../../style";
// import ProgressDisplay from "./ProgressDisplay";
import TokenSoldDisplay from "./TokenSoldDisplay";

function ProgressDisplaySetting(props: any) {
  const classes = useStyles();
  const { register, setValue, errors, watch, control, poolDetail } = props;

  return (
    <div className="">
      <div>
        <label className={classes.exchangeRateTitle}>
          Progress Display Setting
        </label>
        <div style={{ color: "red" }}>
          Please do not touch this field if you do not know what should you do!
        </div>
      </div>
      {/* <ProgressDisplay
        poolDetail={poolDetail}
        register={register}
        setValue={setValue}
        errors={errors}
        control={control}
        watch={watch}
      /> */}

      <TokenSoldDisplay
        poolDetail={poolDetail}
        register={register}
        setValue={setValue}
        errors={errors}
        control={control}
        watch={watch}
      />
    </div>
  );
}

export default ProgressDisplaySetting;
