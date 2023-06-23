import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import FormControl from "@material-ui/core/FormControl";
import CurrencyInput from "react-currency-input-field";
import DefaultLayout from "../../components/Layout/DefaultLayout";

import { useDispatch } from "react-redux";
import useStyles from "./style";

import {
  fieldMustBeGreaterThanZero,
  renderErrorCreatePool,
} from "../../utils/validate";
import { getStatistic, updateStatistic } from "../../request/statistic";
import { alertFailure, alertSuccess } from "../../store/actions/alert";

const Statistic: React.FC = (props: any) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [numberProject, setNumberProject] = useState("");
  const [fundRaised, setFundRaised] = useState("");
  const [avgRoi, setAvgRoi] = useState("");
  const [cSupplyLocked, setCSupplyLocked] = useState("");
  const [statisticData, setStatisticData] = useState();

  const {
    register,
    setValue,
    getValues,
    clearErrors,
    errors,
    handleSubmit,
    control,
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: statisticData,
    reValidateMode: "onChange",
  });

  const renderError = renderErrorCreatePool;

  useEffect(() => {
    getStatistic().then((res) => {
      console.log({ res });
      if (res.status != 200) return dispatch(alertFailure(res.message));
      setStatisticData(res.data);
      setNumberProject(res.data?.number_project);
      setFundRaised(res.data?.fund_raised);
      setAvgRoi(res.data?.avg_roi);
      setValue("numberProject", res.data?.number_project, {
        shouldValidate: true,
      });
      setValue("fundRaised", res.data?.fund_raised, { shouldValidate: true });
      setValue("avgRoi", res.data?.avg_roi, { shouldValidate: true });
    });
  }, []);

  const handleNumberProjectChange = (event: any) => {
    let value = event.target.value;
    setNumberProject(value);
    setValue("numberProject", value, { shouldValidate: true });
  };

  const handleFundRaisedChange = (event: any) => {
    let value = event.target.value;
    setFundRaised(value);
    setValue("fundRaised", value, { shouldValidate: true });
  };

  const handleAvgRoiChange = (event: any) => {
    let value = event.target.value;
    setAvgRoi(value);
    setValue("avgRoi", value, { shouldValidate: true });
  };

  const handleSSupplyLockedRoiChange = (event: any) => {
    let value = event.target.value;
    setCSupplyLocked(value);
    setValue("cSupplyLocked", value, { shouldValidate: true });
  };

  const handleUpdateStatistic = async () => {
    const res = await updateStatistic({
      number_project: numberProject,
      fund_raised: fundRaised,
      avg_roi: avgRoi,
      c_supply_locked: cSupplyLocked,
    });

    dispatch(
      res.status ===200 ? alertSuccess("Success") : alertFailure(res.message)
    );
  };

  return (
    <DefaultLayout>
      <div className={classes.mainStatistic}>
        <FormControl component="fieldset">
          <label className={classes.formControlLabel}>Number project</label>
          <Controller
            control={control}
            id="numberProject"
            name="numberProject"
            render={(field) => {
              return (
                <input
                  {...field}
                  type="text"
                  value={numberProject}
                  className={`${classes.formInputBox}`}
                  placeholder="Please enter a number"
                  onChange={handleNumberProjectChange}
                  maxLength={255}
                />
              );
            }}
          />
          <input
            type="hidden"
            name="numberProject"
            value={numberProject || ""}
            ref={register({
              required: true,
              validate: {
                numberProjectGreaterThanZero: fieldMustBeGreaterThanZero,
              },
            })}
          />

          <p className={classes.formErrorMessage}>
            {renderError(errors, "numberProject")}
          </p>
          <p className={classes.formErrorMessage}>
            {renderError(errors, "numberProjectGreaterThanZero")}
          </p>
        </FormControl>

        <FormControl component="fieldset">
          <label className={classes.formControlLabel}>Fund Raised</label>
          <Controller
            control={control}
            id="fundRaised"
            name="fundRaised"
            render={(field) => {
              return (
                <input
                  {...field}
                  type="text"
                  className={`${classes.formInputBox}`}
                  placeholder="Please enter a number"
                  value={fundRaised}
                  onChange={handleFundRaisedChange}
                  maxLength={255}
                />
              );
            }}
          />
          <input
            type="hidden"
            name="fundRaised"
            value={fundRaised || ""}
            ref={register({
              required: true,
              validate: {
                fundRaisedGreaterThanZero: fieldMustBeGreaterThanZero,
              },
            })}
          />

          <p className={classes.formErrorMessage}>
            {renderError(errors, "fundRaised")}
          </p>
          <p className={classes.formErrorMessage}>
            {renderError(errors, "fundRaisedGreaterThanZero")}
          </p>
        </FormControl>

        <FormControl component="fieldset">
          <label className={classes.formControlLabel}>ATH AVG ROI</label>
          <Controller
            control={control}
            id="avgRoi"
            name="avgRoi"
            render={(field) => {
              return (
                <input
                  {...field}
                  type="text"
                  className={`${classes.formInputBox}`}
                  placeholder="Please enter a number"
                  value={avgRoi}
                  onChange={handleAvgRoiChange}
                  maxLength={255}
                />
              );
            }}
          />
          <input
            type="hidden"
            name="avgRoi"
            value={avgRoi || ""}
            ref={register({
              required: true,
              validate: {
                avgRoiGreaterThanZero: fieldMustBeGreaterThanZero,
              },
            })}
          />

          <p className={classes.formErrorMessage}>
            {renderError(errors, "avgRoi")}
          </p>
          <p className={classes.formErrorMessage}>
            {renderError(errors, "avgRoiGreaterThanZero")}
          </p>
        </FormControl>
        <FormControl component="fieldset">
          <label className={classes.formControlLabel}>C-Supply Locked</label>
          <Controller
            control={control}
            id="cSupplyLocked"
            name="cSupplyLocked"
            render={(field) => {
              return (
                <input
                  {...field}
                  type="text"
                  className={`${classes.formInputBox}`}
                  placeholder="Please enter a number"
                  value={cSupplyLocked}
                  onChange={handleSSupplyLockedRoiChange}
                  maxLength={255}
                />
              );
            }}
          />
          <input
            type="hidden"
            name="cSupplyLocked"
            value={cSupplyLocked || ""}
            ref={register({
              required: true,
              validate: {
                cSupplyLockedGreaterThanZero: fieldMustBeGreaterThanZero,
              },
            })}
          />

          <p className={classes.formErrorMessage}>
            {renderError(errors, "cSupplyLocked")}
          </p>
          <p className={classes.formErrorMessage}>
            {renderError(errors, "cSupplyLockedGreaterThanZero")}
          </p>
        </FormControl>
        <button
          className={classes.formButtonUpdateStatistic}
          onClick={handleUpdateStatistic}
        >
          Update
        </button>
      </div>
    </DefaultLayout>
  );
};

export default Statistic;
