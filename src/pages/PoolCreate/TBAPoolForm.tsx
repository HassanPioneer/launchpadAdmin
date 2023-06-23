import { CircularProgress, Grid } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import { Switch } from "antd";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import { createTBAPool, updateTBAPool } from "../../request/pool";
import { alertFailure, alertSuccess } from "../../store/actions/alert";
import { adminRoute } from "../../utils";
import { renderErrorCreatePool } from "../../utils/validate";
import NetworkAvailable from "./Components/NetworkAvailable";
import PoolBanner from "./Components/PoolBanner";
import PoolName from "./Components/PoolName";
import PoolWebsite from "./Components/PoolWebsite";
import PrivatePoolSetting from "./Components/PrivatePoolSetting";
import useStyles from "./style";

function TBAPoolForm(props: any) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = props.history;
  const renderError = renderErrorCreatePool;

  const { isEdit, poolDetail } = props;
  const [loading, setLoading] = useState(false);
  const [needValidate, setNeedValidate] = useState(false);

  const {
    register,
    setValue,
    errors,
    handleSubmit,
    control,
  } = useForm({
    mode: "onChange",
    defaultValues: poolDetail,
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (poolDetail && poolDetail.is_display != undefined) {
      setValue("is_display", !!poolDetail.is_display);
    }
  }, [poolDetail]);

  const createUpdatePool = async (data: any) => {
    const submitData = {
      is_display: data.is_display,

      title: data.title,
      website: data.website,
      banner: data.banner,
      network_available: data.networkAvailable,
      is_private: data.isPrivate,
    };

    console.log("[createUpdateTBAPool] - Submit with data: ", submitData);

    let response = {};
    if (isEdit) {
      response = await updateTBAPool(submitData, poolDetail.id);
    } else {
      response = await createTBAPool(submitData);
    }

    return response;
  };

  const handleFormSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response: any = await createUpdatePool(data);
      if (response?.status === 200) {
        dispatch(alertSuccess("Successful!"));
        if (isEdit) {
          // window.location.reload();
        } else {
          history.push(adminRoute("/tba-campaigns"));
        }
      } else {
        dispatch(alertFailure("Fail!"));
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log("ERROR: ", e);
    }
  };

  // Create / Update Pool (Before Pool Deployed to Smart Contract)
  const handleCampaignCreateUpdate = () => {
    setNeedValidate(false);
    setTimeout(() => {
      handleSubmit(handleFormSubmit)();
    }, 100);
  };

  return (
    <>
      <div className={classes.boxBottom}>
        <Grid container spacing={2}>
          <Grid item xs={6} className={classes.exchangeRate}>
            <div>
              <label className={classes.formControlLabel}>Display</label>
              <div style={{ color: "red" }}>
                Users will not see Campaigns while the campaign is in the hidden
                state
              </div>
              <FormControl component="fieldset">
                <Controller
                  control={control}
                  name="is_display"
                  render={(field) => {
                    const { value, onChange } = field;
                    return (
                      <Switch
                        checked={value}
                        onChange={async (switchValue) => {
                          // eslint-disable-next-line no-restricted-globals
                          if (!confirm("Do you want change display ?")) {
                            return false;
                          }
                          onChange(switchValue);
                        }}
                        checkedChildren="Display"
                        unCheckedChildren="Hidden"
                      />
                    );
                  }}
                />

                <p className={classes.formErrorMessage}>
                  {renderError(errors, "is_display")}
                </p>
              </FormControl>
              <br />
            </div>

            <PoolName
              poolDetail={poolDetail}
              register={register}
              setValue={setValue}
              errors={errors}
            />

            <PoolBanner
              poolDetail={poolDetail}
              register={register}
              setValue={setValue}
              errors={errors}
            />

            <PoolWebsite
              poolDetail={poolDetail}
              register={register}
              setValue={setValue}
              errors={errors}
            />

            <PrivatePoolSetting
              poolDetail={poolDetail}
              setValue={setValue}
              errors={errors}
              control={control}
            />

            <NetworkAvailable
              poolDetail={poolDetail}
              setValue={setValue}
              errors={errors}
              control={control}
              needValidate={needValidate}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <button
            disabled={loading}
            className={classes.formButtonUpdatePool}
            onClick={handleCampaignCreateUpdate}
          >
            {loading ? (
              <CircularProgress size={25} />
            ) : isEdit ? (
              "Update"
            ) : (
              "Create"
            )}
          </button>
        </Grid>
      </div>
    </>
  );
}

export default withRouter(TBAPoolForm);
