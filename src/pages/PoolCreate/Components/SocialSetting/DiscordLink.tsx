import React from 'react';
import useStyles from "../../style";
import {renderErrorCreatePool} from "../../../../utils/validate";

function DiscordLink(props: any) {
  const classes = useStyles();
  const {
    register, setValue, errors, watch, getValues, needValidate,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;

  const handleChangeDiscordLink = (e: any) => {
    setValue('discord_link', e.target.value);
  }

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Discord Link</label>
        <input
          type="text"
          name="discord_link"
          defaultValue={poolDetail?.socialNetworkSetting?.discord_link}
          ref={register({
            // required: true
          })}
          onChange={handleChangeDiscordLink}
          className={classes.formControlInput}
        />
        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'discord_link')
          }
        </p>
      </div>
    </>
  );
}

export default DiscordLink;
