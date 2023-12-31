import React, {useEffect} from 'react';
import useStyles from "../style";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import {Controller} from "react-hook-form";
import {renderErrorCreatePool} from "../../../utils/validate";
import {POOL_IS_PRIVATE} from "../../../constants";

function PrivatePoolSetting(props: any) {
  const classes = useStyles();
  const {
    setValue, errors, control,
    poolDetail
  } = props;
  const renderError = renderErrorCreatePool;

  useEffect(() => {
    if (poolDetail) {
      if (Object.values(POOL_IS_PRIVATE).includes(poolDetail.is_private)) {
        setValue('isPrivate', poolDetail.is_private + '');
      }
    }
  }, [poolDetail]);
  const isDeployed = !!poolDetail?.is_deploy;

  return (
    <>
      <div className={classes.formControl} style={{display: 'none'}}>
        <FormControl component="fieldset">
          <label className={classes.formControlLabel}>Pool Type</label>
          <Controller
            rules={{ required: true }}
            control={control}
            defaultValue={POOL_IS_PRIVATE.PUBLIC + ''}
            name="isPrivate"
            as={
              <RadioGroup row>
                <FormControlLabel
                  value={POOL_IS_PRIVATE.PUBLIC + ''} control={<Radio />}
                  label="Public"
                  disabled={isDeployed}
                />
                <FormControlLabel
                  value={POOL_IS_PRIVATE.PRIVATE + ''} control={<Radio />}
                  label="Private"
                  disabled={isDeployed}
                />
                <FormControlLabel
                  value={POOL_IS_PRIVATE.SEED + ''} control={<Radio />}
                  label="Seed"
                  disabled={isDeployed}
                />
                <FormControlLabel
                  value={POOL_IS_PRIVATE.COMMUNITY + ''} control={<Radio />}
                  label="Community"
                  disabled={isDeployed}
                />
                <FormControlLabel
                  value={POOL_IS_PRIVATE.EVENT + ''} control={<Radio />}
                  label="Event"
                  disabled={isDeployed}
                />
              </RadioGroup>
            }
          />
          <p className={classes.formErrorMessage}>
            {
              renderError(errors, 'isPrivate')
            }
          </p>
        </FormControl>
      </div>
    </>
  );
}

export default PrivatePoolSetting;
