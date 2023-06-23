import React, { useEffect } from 'react';
import useStyles from "../../style";
import {renderErrorCreatePool} from "../../../../utils/validate";
import {DatePicker} from "antd";
import moment from "moment";
import { Controller } from 'react-hook-form';
import { useCommonStyle } from '../../../../styles';
import { DATETIME_FORMAT } from "../../../../constants";

function FirstTimeClaimPhase(props: any) {
  const classes = useStyles();
  const commonStyle = useCommonStyle();
  const {
    register, setValue, errors, watch, getValues, 
    poolDetail,control
  } = props;
  const renderError = renderErrorCreatePool;
  const isDeployed = !!poolDetail?.is_deploy;

  useEffect(() => {
    if (poolDetail) {
      // First time claim phase
      if (poolDetail.first_time_claim_phase) {
        setValue('first_time_claim_phase', moment(poolDetail.first_time_claim_phase, DATETIME_FORMAT));
      }
    }
  }, [poolDetail]);

  return (
    <>
      
      <div className={classes.formControlFlexBlock}>
        <label className={classes.formControlLabel}>1st claim phase</label>
        <div style={{ marginBottom: 25 }}>
          <Controller
            control={control}
            rules={{
              required: (false),
              validate: {
                // greaterOrEqualToday: (value) => {
                //   if (isDeployed || isBuyTypeFCFS) return true;
                //   console.log(value);
                //   return new Date(value) >= new Date();
                // },
              }
            }}
            name="first_time_claim_phase"
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
                    setValue(field.name, datetimeSelected, { shouldValidate: true });
                  }}
                  minuteStep={15}
                  className={`${commonStyle.DateTimePicker} ${classes.formDatePicker}`}
                  // disabled={isDeployed}
                />
              )
            }}
          />
        </div>
        <div className={`${classes.formErrorMessage} ${classes.formErrorMessageAbsolute}`}>
          {
            renderError(errors, 'first_time_claim_phase')
          }
        </div>
      </div>
    </>
  );
}

export default FirstTimeClaimPhase;
