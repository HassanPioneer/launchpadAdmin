import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import {
  BSC_NETWORK_ACCEPT_CHAINS,
  ETH_NETWORK_ACCEPT_CHAINS,
  NETWORK_AVAILABLE,
  POLYGON_NETWORK_ACCEPT_CHAINS,
} from "../../../constants";
import { renderErrorCreatePool } from "../../../utils/validate";
import useStyles from "../style";

function ClaimNetwork(props: any) {
  const classes = useStyles();
  const { setValue, errors, control, poolDetail, needValidate, watch } = props;
  const renderError = renderErrorCreatePool;
  const { currentNetworkId } = useSelector(
    (state: any) => state
  ).userCurrentNetwork;

  useEffect(() => {
    console.log("poolDetail.network_claim", poolDetail.network_claim);
    if (poolDetail && poolDetail.network_claim) {
      setValue("networkClaim", poolDetail.network_claim);
    }
  }, [poolDetail]);
  const isDeployed = !!poolDetail?.is_deploy;
  const networkAvailable = watch("networkAvailable");

  useEffect(() => {
    // if (poolDetail && poolDetail.network_claim) {
    //   return;
    // }

    setValue("networkClaim", networkAvailable);
  }, [poolDetail, networkAvailable, setValue]);

  return (
    <>
      <div className={classes.formControl} style={{display: "none"}}>
        <FormControl component="fieldset">
          <label className={classes.formControlLabel}>Token Network</label>

          <Controller
            rules={{
              required: true,
              // validate: {
              //   networkNotMatch: (value) => {
              //     // Validate Only click Deploy button
              //     if (!needValidate) return true;
              //     let acceptNet = "";
              //     switch (value) {
              //       case "bsc":
              //         acceptNet = BSC_NETWORK_ACCEPT_CHAINS[currentNetworkId];
              //         break;
              //       case "polygon":
              //         acceptNet =
              //           POLYGON_NETWORK_ACCEPT_CHAINS[currentNetworkId];
              //         break;
              //       default:
              //         acceptNet = ETH_NETWORK_ACCEPT_CHAINS[currentNetworkId];
              //     }

              //     console.log("acceptNet", acceptNet);
              //     if (!acceptNet) {
              //       console.log("Network Deploy not match!!!");
              //       return false;
              //     }
              //     return true;
              //   },
              // },
            }}
            control={control}
            defaultValue={networkAvailable || NETWORK_AVAILABLE.ETH}
            name="networkClaim"
            as={
              <RadioGroup row>
                <FormControlLabel
                  value={NETWORK_AVAILABLE.ETH}
                  control={<Radio />}
                  label="Ether"
                  disabled={isDeployed}
                />
                <FormControlLabel
                  value={NETWORK_AVAILABLE.BSC}
                  control={<Radio />}
                  label="BSC"
                  disabled={isDeployed}
                />
                <FormControlLabel
                  value={NETWORK_AVAILABLE.POLYGON}
                  control={<Radio />}
                  label="Polygon"
                  disabled={isDeployed}
                />
                <FormControlLabel
                  value={NETWORK_AVAILABLE.AVALANCHE}
                  control={<Radio />}
                  label="Avalanche"
                  disabled={isDeployed}
                />
                <FormControlLabel
                  value={NETWORK_AVAILABLE.ARBITRUM}
                  control={<Radio />}
                  label="Arbitrum"
                  disabled={isDeployed}
                />
              </RadioGroup>
            }
          />
          <p className={classes.formErrorMessage}>
            {renderError(errors, "networkClaim")}
            {renderError(errors, "networkNotMatch")}
          </p>
        </FormControl>
      </div>
    </>
  );
}

export default ClaimNetwork;
