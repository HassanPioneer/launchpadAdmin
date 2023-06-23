import React from 'react';
import ConfirmDialog from "../../../../components/Base/ConfirmDialog";
import Button from '@material-ui/core/Button';
import Link from "@material-ui/core/Link";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Grid from '@material-ui/core/Grid';
import useStyles from "../../style";
import { useForm } from "react-hook-form";


function UserWhitelistSubmissionPopup(props: any) {
  const classes = useStyles();
  const {
    isOpenEditPopup, setIsOpenEditPopup, editData, requirements
  } = props;

  const statusOptions = [
    {name: 'PENDING', value: 0},
    {name: 'COMPLETED', value: 1},
    {name: 'ERROR', value: 2},
    {name: 'REJECTED', value: 3},
  ]

  const {
    register, clearErrors, setValue, errors, handleSubmit, control,
    formState: { isValid }
  } = useForm({
    mode: "onChange",
    reValidateMode: 'onChange',
    defaultValues: {
      ...editData
    }
  });

  return (
    <>
      <Dialog
        open={isOpenEditPopup}
        maxWidth={'md'}
        fullWidth
      >
        <DialogTitle>Whitelist Submission</DialogTitle>
        <DialogContent>
          <div className={classes.formControl}>
            <div>
              <label className={classes.formControlLabel}>
                Twitter: <Link href={`https://twitter.com/${editData.user_twitter}`} target={'_blank'}>{editData.user_twitter}</Link>
              </label>
            </div>

            <div>
              <label className={classes.formControlLabel}>Telegram: {editData.user_telegram}</label>
            </div>

            <div>
              <label className={classes.formControlLabel}>Wallet address: {editData.wallet_address}</label>
              <input
                type="hidden"
                name="wallet_address"
                ref={register({ })}
                className={classes.formControlInput}
              />
              <input
                type="hidden"
                name="campaign_id"
                ref={register({ })}
                className={classes.formControlInput}
              />
            </div>
          </div>
        </DialogContent>

        <DialogActions style={{marginTop: '20px'}}>
          <Button onClick={() => { setIsOpenEditPopup(false); }} variant="contained" color="default">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
}

export default UserWhitelistSubmissionPopup;
