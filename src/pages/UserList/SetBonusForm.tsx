import React, {useState} from 'react';
import ConfirmDialog from "../../components/Base/ConfirmDialog";
import useStyles from "./style";
import {useDispatch} from "react-redux";
import {setBonusPointUser} from "../../request/user";
import {alertFailure, alertSuccess} from "../../store/actions/alert";

function SetBonusForm(props: any) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    isOpen, setIsOpen, getUserListInfo,
  } = props;

  const [bonusPoint, setBonusPoint] = useState(0);
  const [wallet, setWallet] = useState("");

  const handleSubmitPopup = async () => {
    try {
      setIsOpen(false)

      const res = await setBonusPointUser({walletAddress: wallet, bonusPoint: Number(bonusPoint)})
      if (res.status !== 200) {
        dispatch(alertFailure('Something wrong'))
        return
      }
      await getUserListInfo('');
      dispatch(alertSuccess('Updated bonus point'))

    } catch (err) {
      console.log(err)
      dispatch(alertFailure('Something wrong'))
    }
  };

  return (
    <>
      <ConfirmDialog
        title={'Bonus Point'}
        open={isOpen}
        confirmLoading={false}
        onConfirm={handleSubmitPopup}
        onCancel={() => { setIsOpen(false) }}
      >

        <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Wallet</label>
          <input
            value={wallet}
            onChange={e => setWallet(e.target.value)}
            className={classes.formControlInput}
          />
        </div>

        <div className={classes.formControl}>
          <label className={classes.formControlLabel}>Bonus Point</label>
          <input
            type="number"
            value={bonusPoint}
            onChange={e => setBonusPoint(Number(e.target.value))}
            className={classes.formControlInput}
          />
        </div>

      </ConfirmDialog>

    </>
  );
}

export default SetBonusForm;
