import { CircularProgress, TableCell, TableRow } from "@material-ui/core";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { months } from "../../../constants";
import useComponentVisible from "../../../hooks/useComponentVisible";
import {
  changeDisplayTopUser,
  changePaidTopUser,
} from "../../../request/referrals";
import { alertFailure, alertSuccess } from "../../../store/actions/alert";
import { trimMiddlePartAddress } from "../../../utils/contractAddress/getAddresses";
import useStyles from "../style";

type UserProps = {
  id: number;
  wallet_address: string;
  successful: number;
  time: string;
  is_paid: number;
  is_display: number;
};

type UserRecordProps = {
  user: UserProps;
  setReload: Function;
};

const UserRecord: React.FC<UserRecordProps> = (props: UserRecordProps) => {
  const {
    user = {
      id: 0,
      wallet_address: "",
      successful: 0,
      time: new Date().toString(),
      is_paid: 0,
      is_display: 0,
    },
    setReload,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [markPaidLoading, setMarkPaidLoading] = useState<boolean>(false);
  const [displayTopLoading, setDisplayTopLoading] = useState<boolean>(false);

  const { ref } = useComponentVisible();

  const handleMaskAsPaid = async (e: any) => {
    e.preventDefault();
    setMarkPaidLoading(true);
    try {
      const response: any = await changePaidTopUser(user.id, !user.is_paid);
      if (response?.status === 200) {
        dispatch(alertSuccess("Successful!"));
        setReload((prev: boolean) => !prev);
      } else {
        dispatch(alertFailure("Fail!"));
      }
      setMarkPaidLoading(false);
    } catch (e) {
      setMarkPaidLoading(false);
      console.log("ERROR: ", e);
    }
  };
  const handleDisplayTopRef = async (e: any) => {
    e.preventDefault();
    setDisplayTopLoading(true);
    try {
      const response: any = await changeDisplayTopUser(
        user.id,
        !user.is_display
      );
      if (response?.status === 200) {
        dispatch(alertSuccess("Successful!"));
        setReload((prev: boolean) => !prev);
      } else {
        dispatch(alertFailure("Fail!"));
      }
      setDisplayTopLoading(false);
    } catch (e) {
      setDisplayTopLoading(false);
      console.log("ERROR: ", e);
    }
  };

  const onCopyWallet = () => {
    navigator.clipboard.writeText(user.wallet_address);
    dispatch(alertSuccess("Wallet Address Copied!"));
  };

  return (
    <TableRow ref={ref} className={classes.tableRow} key={user.id}>
      <TableCell className={classes.tableCellTitle} component="td" scope="row">
        <div className={classes.walletCopy}>
          <span>{trimMiddlePartAddress(user.wallet_address, 7)}</span>
          <img src="images/icon-copy.svg" alt="" onClick={onCopyWallet} />
        </div>
      </TableCell>
      <TableCell className={classes.tableCellTitle} component="td" scope="row">
        {months[new Date(user.time).getMonth() + 1].label}
      </TableCell>
      <TableCell className={classes.tableCellTitle} component="td" scope="row">
        {user.successful?.toString().padStart(2, "0")}
      </TableCell>
      <TableCell className={classes.tableCellTitle} component="td" scope="row">
        100
      </TableCell>

      <TableCell
        className={classes.tableCell}
        align="left"
        style={{ minWidth: 500 }}
      >
        <button
          className={classes.btnView}
          onClick={handleMaskAsPaid}
          disabled={!!user.is_paid}
        >
          {!!user.is_paid ? "Paid" : "Mark as  Paid"}
          {markPaidLoading && (
            <CircularProgress
              size={16}
              style={{ marginLeft: 10 }}
              color="inherit"
            />
          )}
        </button>
        <button
          className={classes.btnView}
          onClick={handleDisplayTopRef}
          style={{ marginLeft: 20 }}
        >
          {!!user.is_display ? "Hide Top Referrers" : "Display Top Referrers"}
          {displayTopLoading && (
            <CircularProgress
              size={16}
              style={{ marginLeft: 10 }}
              color="inherit"
            />
          )}
        </button>
      </TableCell>
    </TableRow>
  );
};

export default UserRecord;
