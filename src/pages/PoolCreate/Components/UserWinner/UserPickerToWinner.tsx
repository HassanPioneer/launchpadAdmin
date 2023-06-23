import React, {useState} from 'react';
import {Button} from "@material-ui/core";
import {useCommonStyle} from "../../../../styles";
import {pickerRandomWinner} from "../../../../request/participants";
import {useDispatch} from "react-redux";
import {alertFailure, alertSuccess} from "../../../../store/actions/alert";
import {PICK_WINNER_RULE} from "../../../../constants";

function UserPickerToWinner(props: any) {
  const { poolDetail } = props;
  const dispatch = useDispatch();

  const handlePickerRandom = async (rule: string) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Do you want pick random ?')) {
      return false;
    }

    // Call API random
    await pickerRandomWinner(poolDetail?.id, rule)
      .then((res) => {
        console.log('[pickerRandomWinner] - res', res);
        if (res.status === 200) {
          dispatch(alertSuccess('Success'));
        } else {
          dispatch(alertFailure('Fail'));
        }
      });
  };

  return (
    <>
      <div style={{
        // paddingLeft: 60,
        // display: 'inline-block',
      }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handlePickerRandom(PICK_WINNER_RULE.RULE_LUCKY_AND_WEIGHT)}
          style={{ marginLeft: 0, marginTop: -5 }}
        >Pick Winners</Button>
      </div>

    </>
  );
}

export default UserPickerToWinner;
