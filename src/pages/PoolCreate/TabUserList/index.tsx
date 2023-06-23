import { Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import MinTier from "../Components/MinTier";
import UserJoinPool from "../Components/UserJoinPool";
import TierTable from "../Components/Tier/TierTable";
import useStyles from "../style";

const TabUserList = (props: any) => {
  const {
    showTab,
    isEdit,
    poolDetail,
    register,
    watch,
    watchBuyType,
    setValue,
    errors,
    control,
  } = props;
  const classes = useStyles();
  const [isBuyTypeWhitelist, setIsBuyTypeWhitelist] = useState<boolean>(false);

  useEffect(() => {
    if (watchBuyType) {
      setIsBuyTypeWhitelist(watchBuyType === "whitelist");
    }
  }, [watchBuyType]);

  return (
    <div style={{ display: showTab ? "inherit" : "none" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} className={classes.exchangeRate}>
          <MinTier
            poolDetail={poolDetail}
            setValue={setValue}
            errors={errors}
            control={control}
          />

          <TierTable
            poolDetail={poolDetail}
            register={register}
            watch={watch}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          {isEdit && poolDetail?.id && isBuyTypeWhitelist && (
            <div className={classes.exchangeRate}>
              <UserJoinPool
                poolDetail={poolDetail}
                setValue={setValue}
                errors={errors}
                control={control}
              />
            </div>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default TabUserList;
