import React, { useEffect } from "react";
import useStyles from "../../style";
import { renderErrorCreatePool } from "../../../../utils/validate";
import { Controller } from "react-hook-form";
import { Select, MenuItem } from "@material-ui/core";
import { CLAIM_TYPE } from "../../../../constants";

function ClaimType(props: any) {
  const classes = useStyles();
  const { setValue, errors, control, poolDetail } = props;
  const renderError = renderErrorCreatePool;

  useEffect(() => {
    if (poolDetail && poolDetail.claim_type) {
      setValue('claim_type', poolDetail.claim_type);
    }
  }, [poolDetail]);
  const isDeployed = !!poolDetail?.is_deploy;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Claim Type</label>
        <Controller
          rules={{ required: true }}
          control={control}
          defaultValue={CLAIM_TYPE.CLAIM_ON_LAUNCHPAD}
          className={classes.formControlInput}
          name="claim_type"
          as={
            <Select
              labelId="claim_type"
              id="claim_type"
              name="claim_type"
              // disabled={isDeployed}
            >
              <MenuItem value={CLAIM_TYPE.CLAIM_ON_LAUNCHPAD}>
                Claim on Launchpad
              </MenuItem>
              <MenuItem value={CLAIM_TYPE.AIRDROP_TO_PARTICIPANTS_WALLETS}>
                Airdrop to participants' wallets
              </MenuItem>
              <MenuItem value={CLAIM_TYPE.CLAIM_A_PART_OF_TOKENS_ON_LAUNCHPAD}>
                Claim a part of tokens on Launchpad
              </MenuItem>
              <MenuItem value={CLAIM_TYPE.CLAIM_ON_THE_PROJECT_WEBSITE}>
                Claim on the project website
              </MenuItem>
            </Select>
          }
        />
        <p className={classes.formErrorMessage}>
          {renderError(errors, "claim_type")}
        </p>
      </div>
    </>
  );
}

export default ClaimType;
