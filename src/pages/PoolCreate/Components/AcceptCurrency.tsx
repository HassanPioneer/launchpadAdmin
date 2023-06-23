import React, { useEffect, useState } from "react";
import useStyles from "../style";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import { Controller } from "react-hook-form";
import { getTiers } from "../../../request/tier";
import { renderErrorCreatePool } from "../../../utils/validate";
import { NETWORK_AVAILABLE } from "../../../constants";

function AcceptCurrency(props: any) {
  const classes = useStyles();
  const { setValue, errors, control, watch, poolDetail } = props;
  const [isMounted, setIsMounted] = useState(false);
  const renderError = renderErrorCreatePool;

  useEffect(() => {
    if (poolDetail && poolDetail.accept_currency) {
      setValue("acceptCurrency", poolDetail.accept_currency);
    }
  }, [poolDetail]);

  useEffect(() => {
    if (poolDetail && poolDetail.id) {
      getTiers(poolDetail.id).then((res) => {});
    }
  }, [poolDetail]);

  const isDeployed = !!poolDetail?.is_deploy;
  const networkAvailable = watch("networkAvailable");
  const acceptCurrency = watch("acceptCurrency");
  useEffect(() => {
    if (poolDetail.network_available !== networkAvailable) {
      setValue("acceptCurrency", "usdt");
    }
  }, [networkAvailable]);
  let nativeTokenLabel = "ETH";
  let usdtTokenLabel = "USDT";
  let showUsdc = true;
  let showBusd = false;
  switch (networkAvailable) {
    case NETWORK_AVAILABLE.BSC:
      nativeTokenLabel = "BNB";
      showUsdc = true;
      showBusd = true;
      break;
    case NETWORK_AVAILABLE.POLYGON:
      nativeTokenLabel = "MATIC";
      usdtTokenLabel = "USDT";
      showUsdc = true;
      break;
    case NETWORK_AVAILABLE.AVALANCHE:
      nativeTokenLabel = "AVAX";
      usdtTokenLabel = "USDT";
      showUsdc = false;
      break;
    case NETWORK_AVAILABLE.ARBITRUM:
      nativeTokenLabel = "ETH";
      showUsdc = false;
      break;
    default:
    // default is init value above
  }

  // console.log('userCurrentNetwork', isBscNetworks);

  return (
    <>
      <div className={classes.formControl}>
        <FormControl component="fieldset">
          <label className={classes.formControlLabel}>Accepted Currency</label>

          <Controller
            rules={{ required: true }}
            control={control}
            defaultValue={poolDetail?.accept_currency || "usdt"}
            name="acceptCurrency"
            as={
              <RadioGroup row>
              {showBusd && (
                <FormControlLabel
                  value="busd"
                  control={<Radio />}
                  label="BUSD"
                  disabled={isDeployed}
                />
              )}
                <FormControlLabel
                  value="usdt"
                  control={<Radio />}
                  label="USDT"
                  disabled={isDeployed}
                />
                {showUsdc && (
                  <FormControlLabel
                    value="usdc"
                    control={<Radio />}
                    label="USDC"
                    disabled={isDeployed}
                  />
                )}
                {/* <FormControlLabel
                  value={nativeTokenLabel.toLowerCase()}
                  control={<Radio />}
                  label={nativeTokenLabel}
                  disabled={isDeployed}
                /> */}
              </RadioGroup>
            }
          />
          <p className={classes.formErrorMessage}>
            {renderError(errors, "acceptCurrency")}
          </p>
        </FormControl>
      </div>
    </>
  );
}

export default AcceptCurrency;
