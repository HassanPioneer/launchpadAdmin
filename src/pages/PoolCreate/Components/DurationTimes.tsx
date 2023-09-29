import { MenuItem, Select } from "@material-ui/core";
import { DatePicker } from "antd";
import moment from "moment";
import React from "react";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import {
  BUY_TYPE,
  DATETIME_FORMAT,
  POOL_TYPE,
  TIERS,
  TIERS_LABEL,
} from "../../../constants";
import { useCommonStyle } from "../../../styles";
import { campaignClaimConfigFormat } from "../../../utils/campaign";
import { renderErrorCreatePool } from "../../../utils/validate";
import useStyles from "../style";
import BigNumber from 'bignumber.js';

const ONE_HOUR_TO_MIL = 60 * 60 * 1000;

function DurationTime(props: any) {
  const classes = useStyles();
  const commonStyle = useCommonStyle();
  const { setValue, getValues, errors, control, watch, poolDetail, needValidate } = props;
  const renderError = renderErrorCreatePool;

  useEffect(() => {
    if (poolDetail) {
      // Join Times
      if (poolDetail.start_join_pool_time) {
        setValue("start_join_pool_time", moment(poolDetail.start_join_pool_time, DATETIME_FORMAT));
      }
      if (poolDetail.end_join_pool_time) {
        setValue("end_join_pool_time", moment(poolDetail.end_join_pool_time, DATETIME_FORMAT));
      }
      if (poolDetail.announcement_time) {
        setValue("announcement_time", moment(poolDetail.announcement_time, DATETIME_FORMAT));
      }

      // Pre-Order Times
      if (poolDetail.start_pre_order_time) {
        setValue("start_pre_order_time", moment(poolDetail.start_pre_order_time, DATETIME_FORMAT));
      }

      // Min tier Pre-Order
      setValue("pre_order_min_tier", poolDetail.pre_order_min_tier || TIERS.EAGLE);

      // Swap Times
      if (poolDetail.start_time) {
        setValue("start_time", moment(poolDetail.start_time, DATETIME_FORMAT));
      }
      if (poolDetail.finish_time) {
        setValue("finish_time", moment(poolDetail.finish_time, DATETIME_FORMAT));
      }
      if (poolDetail && poolDetail.freeBuyTimeSetting) {
        const fieldValue = poolDetail?.freeBuyTimeSetting?.start_buy_time;
        const isEmptyValue = !fieldValue || new BigNumber(fieldValue).isZero();
        setValue(
          'start_time_free_buy',
          isEmptyValue ? null : moment.unix(fieldValue)
        );
      }

      // Release Time
      if (poolDetail.release_time) {
        setValue("release_time", moment(poolDetail.release_time, DATETIME_FORMAT));
      }
      // Listing Time
      if (poolDetail.listing_time) {
        setValue("listing_time", moment(poolDetail.listing_time, DATETIME_FORMAT));
      }

      // Refund Time
      if (poolDetail.end_refund_time) {
        setValue("end_refund_time", moment(poolDetail.end_refund_time, DATETIME_FORMAT));
      }
    }
  }, [poolDetail, setValue]);

  const isDeployed = !!poolDetail?.is_deploy;
  const watchBuyType = watch("buyType");
  const watchPoolType = watch("poolType");
  const watchClaimType = watch("claim_type");
  const isBuyTypeFCFS = watchBuyType === BUY_TYPE.FCFS;
  const isPoolTypeSwap = watchPoolType === POOL_TYPE.SWAP;

  // Convert and format campaignClaimConfig table
  const campaignClaimConfigJSON = watch("campaignClaimConfig");
  useEffect(() => {
    if (campaignClaimConfigJSON) {
      try {
        let campaignClaimConfig = campaignClaimConfigFormat(campaignClaimConfigJSON);
        if (campaignClaimConfig && campaignClaimConfig.length > 0) {
          if (campaignClaimConfig[0]?.startTime) {
            let claimTimeValue = Number(campaignClaimConfig[0]?.startTime); // Format: Timestamp
            // Convert claimTimeValue from "1625072400" to Moment Object
            const claimTimeObject = moment(claimTimeValue * 1000);
            setValue("release_time", claimTimeObject);
          }
        } else {
          setValue("release_time", null);
        }
      } catch (e) {
        console.log("ERROR: ", e);
      }
    }
  }, [campaignClaimConfigJSON, setValue]);

  return (
    <>
      <div className={classes.formControlFlex}>
        <div className={classes.formControlFlexBlock}>
          <label className={classes.formControlLabel}>Whitelist Start / Competition Start</label>
          <div style={{ marginBottom: 25 }}>
            <Controller
              control={control}
              rules={{
                required: needValidate && !isBuyTypeFCFS,
                validate: {
                  // greaterOrEqualToday: (value) => {
                  //   if (isDeployed || isBuyTypeFCFS) return true;
                  //   console.log(value);
                  //   return new Date(value) >= new Date();
                  // },
                },
              }}
              name="start_join_pool_time"
              render={(field) => {
                return (
                  <DatePicker
                    {...field}
                    format="YYYY-MM-DD HH:mm:ss"
                    showTime={{
                      defaultValue: moment("00:00:00", "HH:mm:ss"),
                      format: "HH:mm",
                    }}
                    onSelect={(datetimeSelected: any) => {
                      setValue(field.name, datetimeSelected, {
                        shouldValidate: true,
                      });
                    }}
                    minuteStep={15}
                    className={`${commonStyle.DateTimePicker} ${classes.formDatePicker}`}
                    disabled={isDeployed || isBuyTypeFCFS}
                  />
                );
              }}
            />
          </div>
          <div className={`${classes.formErrorMessage} ${classes.formErrorMessageAbsolute}`}>
            {renderError(errors, "start_join_pool_time")}
          </div>
        </div>

        <div className={classes.formControlFlexBlock}>
          <label className={classes.formControlLabel}>Whitelist End / Competition End</label>
          <div style={{ marginBottom: 25 }}>
            <Controller
              control={control}
              rules={{
                required: needValidate && !isBuyTypeFCFS,
                validate: {
                  greateOrEqualStartJoinPoolTime: (value) => {
                    if (!needValidate) return true;
                    if (isDeployed || isBuyTypeFCFS) return true;
                    const startTime = getValues("start_join_pool_time");
                    const valueUnix = moment(value).unix();
                    const startTimeUnix = moment(startTime).unix();
                    console.log("Validate End Join Time", valueUnix, startTimeUnix);

                    return startTime ? valueUnix > startTimeUnix : valueUnix > moment().unix();
                  },
                },
              }}
              name="end_join_pool_time"
              render={(field) => {
                return (
                  <DatePicker
                    {...field}
                    format="YYYY-MM-DD HH:mm:ss"
                    showTime={{
                      defaultValue: moment("00:00:00", "HH:mm:ss"),
                      format: "HH:mm",
                    }}
                    onSelect={(datetimeSelected: any) => {
                      setValue(field.name, datetimeSelected, {
                        shouldValidate: true,
                      });
                    }}
                    minuteStep={15}
                    className={`${commonStyle.DateTimePicker} ${classes.formDatePicker}`}
                    disabled={isDeployed || isBuyTypeFCFS}
                  />
                );
              }}
            />
          </div>
          <div className={`${classes.formErrorMessage} ${classes.formErrorMessageAbsolute}`}>
            {renderError(errors, "end_join_pool_time")}
          </div>
        </div>
      </div>

      <div className={classes.formControlFlex}>

      <div className={classes.formControlFlexBlock}>
          <label className={classes.formControlLabel}>Announcement Time</label>
          <div style={{ marginBottom: 15 }}>
            <Controller
              control={control}
              rules={{
              }}
              name="announcement_time"
              render={(field) => {
                return (
                  <DatePicker
                    {...field}
                    format="YYYY-MM-DD HH:mm:ss"
                    showTime={{
                      defaultValue: moment("00:00:00", "HH:mm:ss"),
                      format: "HH:mm"
                    }}
                    onSelect={(datetimeSelected: any) => {
                      setValue(field.name, datetimeSelected, {shouldValidate: true});
                    }}
                    minuteStep={15}
                  />
                )
              }}
            />
          </div>
          <div className={`${classes.formErrorMessage} ${classes.formErrorMessageAbsolute}`}>
            {renderError(errors, "announcement_time")}
          </div>
        </div>
      </div>

      <div className={classes.formControlFlex}>
        <div className={classes.formControlFlexBlock}>
          <label className={classes.formControlLabel}>Min Tier Pre-Order</label>
          <div style={{ marginBottom: 25 }}>
            <Controller
              control={control}
              defaultValue={TIERS.EAGLE}
              name="pre_order_min_tier"
              render={(field) => {
                return (
                  <Select
                    {...field}
                    onChange={(event) => setValue(field.name, event.target.value)}
                    disabled={isDeployed || isBuyTypeFCFS}
                    defaultValue={TIERS.HAWK}
                  >
                    {TIERS_LABEL.map((value, index) => {
                      return (
                        <MenuItem key={index} value={index}>
                          {value}
                        </MenuItem>
                      );
                    })}
                  </Select>
                );
              }}
            />
          </div>
          <div className={`${classes.formErrorMessage} ${classes.formErrorMessageAbsolute}`}>
            {renderError(errors, "pre_order_min_tier")}
          </div>
        </div>

        <div className={classes.formControlFlexBlock}>
          <label className={classes.formControlLabel}>Start Pre-Order Time</label>
          <div style={{ marginBottom: 25 }}>
            <Controller
              control={control}
              rules={{
                // required: (needValidate && !isBuyTypeFCFS),
                validate: {
                  // greaterOrEqualToday: (value) => {
                  //   if (isDeployed || isBuyTypeFCFS) return true;
                  //   console.log(value);
                  //   return new Date(value) >= new Date();
                  // },
                },
              }}
              name="start_pre_order_time"
              render={(field) => {
                return (
                  <DatePicker
                    {...field}
                    format="YYYY-MM-DD HH:mm:ss"
                    showTime={{
                      defaultValue: moment("00:00:00", "HH:mm:ss"),
                      format: "HH:mm",
                    }}
                    onSelect={(datetimeSelected: any) => {
                      setValue(field.name, datetimeSelected, {
                        shouldValidate: true,
                      });
                    }}
                    minuteStep={15}
                    className={`${commonStyle.DateTimePicker} ${classes.formDatePicker}`}
                    disabled={isDeployed || isBuyTypeFCFS}
                  />
                );
              }}
            />
          </div>
          <div className={`${classes.formErrorMessage} ${classes.formErrorMessageAbsolute}`}>
            {renderError(errors, "start_pre_order_time")}
          </div>
        </div>
      </div>

      <div className={classes.formControlFlex}>
        <div className={classes.formControlFlexBlock}>
          <label className={classes.formControlLabel}>Start buy time</label>
          <div style={{ marginBottom: 15 }}>
            <Controller
              control={control}
              rules={{
                required: needValidate,
              }}
              name="start_time"
              render={(field) => {
                return (
                  <DatePicker
                    {...field}
                    format="YYYY-MM-DD HH:mm:ss"
                    showTime={{
                      defaultValue: moment("00:00:00", "HH:mm:ss"),
                      format: "HH:mm",
                    }}
                    onSelect={(datetimeSelected: any) => {
                      setValue(field.name, datetimeSelected, {
                        shouldValidate: true,
                      });
                    }}
                    minuteStep={15}
                    className={`${commonStyle.DateTimePicker} ${classes.formDatePicker}`}
                    disabled={isDeployed}
                  />
                );
              }}
            />
          </div>
          <div className={`${classes.formErrorMessage} ${classes.formErrorMessageAbsolute}`}>
            {renderError(errors, "start_time")}
          </div>
        </div>
        <img className={classes.formControlIcon} src="/images/icon-line.svg" alt="" />
        <div className={classes.formControlFlexBlock}>
          <label className={classes.formControlLabel}>Finish buy time</label>
          <div style={{ marginBottom: 15 }}>
            <Controller
              control={control}
              rules={{
                required: needValidate && !isBuyTypeFCFS,
                validate: {
                  greateOrEqualStartTime: (value) => {
                    if (!needValidate) return true;
                    const startTime = getValues("start_time");
                    const valueUnix = moment(value).unix();
                    const startTimeUnix = moment(startTime).unix();
                    console.log("Validate Finish Time", valueUnix, startTimeUnix);

                    return startTime ? valueUnix > startTimeUnix : valueUnix > moment().unix();
                  },
                },
              }}
              name="finish_time"
              render={(field) => {
                return (
                  <DatePicker
                    {...field}
                    format="YYYY-MM-DD HH:mm:ss"
                    showTime={{
                      defaultValue: moment("00:00:00", "HH:mm:ss"),
                      format: "HH:mm",
                    }}
                    onSelect={(datetimeSelected: any) => {
                      setValue(field.name, datetimeSelected, {
                        shouldValidate: true,
                      });
                    }}
                    minuteStep={15}
                    className={`${commonStyle.DateTimePicker} ${classes.formDatePicker}`}
                    disabled={isDeployed}
                  />
                );
              }}
            />
          </div>
          <div className={`${classes.formErrorMessage} ${classes.formErrorMessageAbsolute}`}>
            {renderError(errors, "finish_time")}
          </div>
        </div>
      </div>


      <div className={classes.formControlFlex}>
        <div className={classes.formControlFlexBlock}>
          <label className={classes.formControlLabel}>Start FCFS time (between start & finish time) - only apply for whitelisted users</label>
          <div style={{ marginBottom: 15 }}>
            <Controller
              control={control}
              rules={{
                required: needValidate,
                validate: {
                  greateOrEqualStartTime: (value) => {
                    if (!needValidate) return true;
                    const startTime = getValues("start_time");
                    const valueUnix = moment(value).unix();
                    const startTimeUnix = moment(startTime).unix();

                    console.log("Validate Start FCFS Time", valueUnix, startTimeUnix);
                    return startTime ? valueUnix > startTimeUnix : valueUnix > moment().unix();
                  },
                  lessThanFinishTime: (value) => {
                    if (!needValidate) return true;
                    const finishTime = getValues("finish_time");
                    const valueUnix = moment(value).unix();
                    const finishTimeUnix = moment(finishTime).unix();

                    return finishTime ? valueUnix < finishTimeUnix : valueUnix > moment().unix();
                  },
                },
              }}
              name="start_time_free_buy"
              render={(field) => {
                return (
                  <DatePicker
                    {...field}
                    format="YYYY-MM-DD HH:mm:ss"
                    showTime={{
                      defaultValue: moment("00:00:00", "HH:mm:ss"),
                      format: "HH:mm"
                    }}
                    onSelect={(datetimeSelected: any) => {
                      setValue(field.name, datetimeSelected, {shouldValidate: true});
                    }}
                    className={`${commonStyle.DateTimePicker} ${classes.formDatePicker}`}
                    minuteStep={15}
                  />
                )
              }}
            />
          </div>
          <div className={`${classes.formErrorMessage} ${classes.formErrorMessageAbsolute}`}>
            {renderError(errors, "start_time_free_buy")}
          </div>
        </div>
      </div>

      <div className={classes.formControlFlex} style={{ alignItems: "normal" }}>
        <div className={classes.formControlFlexBlock}>
          <label className={classes.formControlLabel}>Claim time</label>
          <div style={{ marginBottom: 15 }}>
            <Controller
              control={control}
              // rules={{
              //   required:
              //     needValidate &&
              //     !isPoolTypeSwap &&
              //     (watchClaimType === CLAIM_TYPE.CLAIM_ON_LAUNCHPAD ||
              //       watchClaimType === CLAIM_TYPE.CLAIM_A_PART_OF_TOKENS_ON_LAUNCHPAD),
              //   validate: {
              //     greaterOrEqualFinishTime: (value) => {
              //       if (
              //         watchClaimType !== CLAIM_TYPE.CLAIM_ON_LAUNCHPAD &&
              //         watchClaimType !== CLAIM_TYPE.CLAIM_A_PART_OF_TOKENS_ON_LAUNCHPAD
              //       )
              //         return true;
              //       if (!needValidate) return true;
              //       if (isPoolTypeSwap) return true;
              //       const startTime = getValues("finish_time");
              //       const valueUnix = moment(value).unix();
              //       const startTimeUnix = moment(startTime).unix();
              //       console.log("Validate Claim Time", valueUnix, startTimeUnix);

              //       return startTime ? valueUnix > startTimeUnix : valueUnix > moment().unix();
              //     },
              //   },
              // }}
              name="release_time"
              render={(field) => {
                return (
                  <DatePicker
                    {...field}
                    format="YYYY-MM-DD HH:mm:ss"
                    showTime={{
                      defaultValue: moment("00:00:00", "HH:mm:ss"),
                      format: "HH:mm",
                    }}
                    onSelect={(datetimeSelected: any) => {
                      setValue(field.name, datetimeSelected, {
                        shouldValidate: true,
                      });
                    }}
                    minuteStep={15}
                    className={`${commonStyle.DateTimePicker} ${classes.formDatePicker}`}
                    // disabled={isDeployed || isPoolTypeSwap}
                    disabled={true} // Always disable. Fill first record of Claim Configuration to this field
                  />
                );
              }}
            />
          </div>
          {/* <div style={{ color: "blue" }}>
            <p>Please config first record of Claim Configuration Table.</p>
            <p>
              This field will auto fill from first record of Claim Configuration
              Table.
            </p>
          </div> */}
          <div className={`${classes.formErrorMessage} ${classes.formErrorMessageAbsolute}`}>
            {renderError(errors, "release_time")}
          </div>
        </div>
      </div>

      <div className={classes.formControlFlex}>
        <div className={classes.formControlFlexBlock}>
          <label className={classes.formControlLabel}>Listing time / Start refund time</label>
          <div style={{ marginBottom: 15 }}>
            <Controller
              control={control}
              rules={{ required: false }}
              name="listing_time"
              render={(field) => {
                return (
                  <DatePicker
                    {...field}
                    format="YYYY-MM-DD HH:mm:ss"
                    showTime={{
                      defaultValue: moment("00:00:00", "HH:mm:ss"),
                      format: "HH:mm",
                    }}
                    minuteStep={15}
                    className={`${commonStyle.DateTimePicker} ${classes.formDatePicker}`}
                  />
                );
              }}
            />
          </div>
          <div className={`${classes.formErrorMessage} ${classes.formErrorMessageAbsolute}`}>
            {renderError(errors, "listing_time")}
          </div>
        </div>

        <div className={classes.formControlFlexBlock}>
          <label className={classes.formControlLabel}>End refund time</label>
          <div style={{ marginBottom: 15 }}>
            <Controller
              control={control}
              rules={{}}
              name="end_refund_time"
              render={(field) => {
                return (
                  <DatePicker
                    {...field}
                    format="YYYY-MM-DD HH:mm:ss"
                    showTime={{
                      defaultValue: moment("00:00:00", "HH:mm:ss"),
                      format: "HH:mm",
                    }}
                    onSelect={(datetimeSelected: any) => {
                      setValue(field.name, datetimeSelected, {
                        shouldValidate: true,
                      });
                    }}
                    minuteStep={15}
                    className={`${commonStyle.DateTimePicker} ${classes.formDatePicker}`}
                  />
                );
              }}
            />
          </div>
          <div className={`${classes.formErrorMessage} ${classes.formErrorMessageAbsolute}`}>
            {renderError(errors, "end_refund_time")}
          </div>
        </div>
      </div>
    </>
  );
}

export default DurationTime;
