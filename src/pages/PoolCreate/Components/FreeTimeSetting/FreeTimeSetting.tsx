import React from "react";
import useStyles from "../../style";
import StartTimeFreeBuy from "./StartTimeFreeBuy";
import MaxBonus from "./MaxBonus";
import AnnouncementTime from "../WhitelistBannerSetting/AnnouncementTime";

function FreeTimeSetting(props: any) {
  const classes = useStyles();
  const { register, setValue, errors, watch, control, poolDetail } = props;

  return (
    <>
      <div>
        <label className={classes.exchangeRateTitle}>
          FCFS Settings
        </label>

      </div>

      {/* <MaxBonus
        poolDetail={poolDetail}
        register={register}
        setValue={setValue}
        errors={errors}
        control={control}
        watch={watch}
      /> */}

      <AnnouncementTime
        poolDetail={poolDetail}
        register={register}
        setValue={setValue}
        errors={errors}
        control={control}
        watch={watch}
      />
    </>
  );
}

export default FreeTimeSetting;
