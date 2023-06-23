import React from 'react';
import useStyles from "../style";
import { renderErrorCreatePool } from "../../../utils/validate";

function ParticipantNumber(props: any) {
    const classes = useStyles();
    const {
        register, setValue, errors, watch, getValues, needValidate,
        poolDetail,
    } = props;
    const renderError = renderErrorCreatePool;

    return (
        <>
            <div className={classes.formControl}>
                <label className={classes.formControlLabel}>Participant Number</label>
                <input
                    type="text"
                    name="participant_number"
                    defaultValue={poolDetail?.participant_number}
                    ref={register({
                        // required: true
                    })}
                    className={classes.formControlInput}
                />
                <p className={classes.formErrorMessage}>
                    {
                        renderError(errors, 'participant_number')
                    }
                </p>
            </div>
        </>
    );
}

export default ParticipantNumber;
