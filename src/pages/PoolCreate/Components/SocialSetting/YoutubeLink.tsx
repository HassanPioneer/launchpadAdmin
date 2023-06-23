import React from "react";
import useStyles from "../../style";
import { renderErrorCreatePool } from "../../../../utils/validate";

function YoutubeLink(props: any) {
  const classes = useStyles();
  const {
    register,
    setValue,
    errors,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;

  const handleChangeYoutubeLink = (e: any) => {
    setValue("youtube_link", e.target.value);
  };

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Youtube Link</label>
        <input
          type="text"
          name="youtube_link"
          defaultValue={poolDetail?.socialNetworkSetting?.youtube_link}
          ref={register({
            // required: true
          })}
          onChange={handleChangeYoutubeLink}
          className={classes.formControlInput}
        />
        <p className={classes.formErrorMessage}>
          {renderError(errors, "youtube_link")}
        </p>
      </div>
    </>
  );
}

export default YoutubeLink;
