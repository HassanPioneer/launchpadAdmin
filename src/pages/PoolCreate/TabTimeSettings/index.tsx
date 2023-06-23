import { Grid } from "@material-ui/core";
import React from "react";
import { POOL_IS_PRIVATE } from "../../../constants";
import ClaimConfigTable from "../Components/ClaimConfig/ClaimConfigTable";
import DurationTime from "../Components/DurationTimes";
import FreeTimeSetting from "../Components/FreeTimeSetting/FreeTimeSetting";
import useStyles from "../style";

const TabTimeSettings = (props: any) => {
  const {
    showTab,
    poolDetail,
    setValue,
    errors,
    control,
    register,
    watch,
    token,
    setToken,
    getValues,
    needValidate,
    watchIsPrivate,
  } = props;
  const classes = useStyles();
  const poolType = watchIsPrivate ? Number(watchIsPrivate) : 0;
  const poolForCommunity =
    poolType === POOL_IS_PRIVATE.COMMUNITY ||
    poolType === POOL_IS_PRIVATE.EVENT;

  return (
    <div style={{ display: showTab ? "inherit" : "none" }}>
      <Grid container spacing={2}>
        <Grid item xs={6} className={classes.exchangeRate}>
          <DurationTime
            poolDetail={poolDetail}
            register={register}
            token={token}
            setToken={setToken}
            setValue={setValue}
            errors={errors}
            control={control}
            getValues={getValues}
            watch={watch}
            needValidate={needValidate}
          />
        </Grid>
        <Grid item xs={6} className={classes.exchangeRate}>
          <div>
            <ClaimConfigTable
              poolDetail={poolDetail}
              setValue={setValue}
              register={register}
              watch={watch}
              errors={errors}
              control={control}
            />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default TabTimeSettings;
