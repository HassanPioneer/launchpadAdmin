import React, {useEffect} from 'react';
import useStyles from "../style";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { Controller } from "react-hook-form";
import {renderErrorCreatePool} from "../../../utils/validate";
import {TOKEN_TYPE} from "../../../constants";

function TokenType(props: any) {
  const classes = useStyles();
  const {
    setValue, errors, control,
    poolDetail
  } = props;
  const renderError = renderErrorCreatePool;

  useEffect(() => {
    if (poolDetail && poolDetail.pool_type) {
      setValue('poolType', poolDetail.pool_type, { shouldValidate: true });
    }
  }, [poolDetail]);
  const isDeployed = !!poolDetail?.is_deploy;

  return (
    <>
      <div className={classes.formControl}>
        <FormControl component="fieldset">
          <label className={classes.formControlLabel}>Token Type</label>

          <Controller
            rules={{ required: true }}
            control={control}
            defaultValue={TOKEN_TYPE.ERC20}
            name="tokenType"
            as={
              <RadioGroup row>
                <FormControlLabel
                  value={TOKEN_TYPE.BEP20} control={<Radio />}
                  label="BEP20"
                  disabled={isDeployed}
                />
                <FormControlLabel
                  value={TOKEN_TYPE.ERC20} control={<Radio />}
                  label="ERC20"
                  disabled={isDeployed}
                />
              </RadioGroup>
            }
          />
          <p className={classes.formErrorMessage}>
            {
              renderError(errors, 'tokenType')
            }
          </p>
        </FormControl>
      </div>
    </>
  );
}

export default TokenType;
