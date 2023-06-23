// @ts-ignore
import { CKEditor } from "ckeditor4-react";
import React from "react";
import { Controller } from "react-hook-form";
import { renderErrorCreatePool } from "../../../../utils/validate";
import useStyles from "../../style";

function ClaimGuide(props: any) {
  const classes = useStyles();
  const { register, setValue, errors, watch, getValues, poolDetail, control } =
    props;
  const renderError = renderErrorCreatePool;
  const isDeployed = !!poolDetail?.is_deploy;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.exchangeRateTitle}>Claim Guide</label>
        <Controller
          control={control}
          rules={{
            required: false,
          }}
          name="claim_guide"
          render={(field) => {
            return (
              <CKEditor
                {...field}
                config={{
                  language: "en",
                  extraPlugins: "colorbutton",
                  colorButton_colors:
                    "D01F36,5EFF8B,6788FF,FFD058,B073FF," +
                    "1ABC9C,2ECC71,3498DB,9B59B6,4E5F70,F1C40F," +
                    "16A085,27AE60,2980B9,8E44AD,2C3E50,F39C12," +
                    "E67E22,E74C3C,ECF0F1,95A5A6,DDD,FFF," +
                    "D35400,C0392B,BDC3C7,7F8C8D,999,000",
                }}
                name="claim_guide"
                ref={register({})}
                initData={poolDetail?.claim_guide}
                onReady={(editor: any) => {
                  // You can store the "editor" and use when it is needed.
                  // console.log( 'Editor is ready to use!', editor );
                }}
                onChange={(event: any) => {
                  const data = event.editor.getData();
                  setValue(field.name, data);
                }}
                disabled={isDeployed}
              />
            );
          }}
        />
        <p className={classes.formErrorMessage}>
          {renderError(errors, "claim_guide")}
        </p>
      </div>
    </>
  );
}

export default ClaimGuide;
