import { TableCell, TableRow } from "@material-ui/core";
import React from "react";
import { useDispatch } from "react-redux";
import useComponentVisible from "../../../hooks/useComponentVisible";
import { alertSuccess } from "../../../store/actions/alert";
import { trimMiddlePartAddress } from "../../../utils/contractAddress/getAddresses";
import useStyles from "../style";

type UserProps = {
  wallet_address: string;
  signup: number;
  successful: number;
  earn_allocation: string;
  used_allocation: string;
};

type UserRecordProps = {
  user: UserProps;
  viewUserRefHistory: (address: string) => void;
};

const UserRecord: React.FC<UserRecordProps> = (props: UserRecordProps) => {
  const {
    user = {
      wallet_address: "",
      signup: 0,
      successful: 0,
      earn_allocation: "0",
      used_allocation: "0",
    },
    viewUserRefHistory,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  const { ref } = useComponentVisible();

  const handleViewHistory = (e: any) => {
    e.preventDefault();
    viewUserRefHistory(user.wallet_address);
  };

  const onCopyWallet = () => {
    navigator.clipboard.writeText(user.wallet_address);
    dispatch(alertSuccess("Wallet Address Copied!"));
  };

  return (
    <TableRow ref={ref} className={classes.tableRow} key={user.wallet_address}>
      <TableCell className={classes.tableCellTitle} component="td" scope="row">
        <div className={classes.walletCopy}>
          <span>{trimMiddlePartAddress(user.wallet_address, 7)}</span>
          <img src="images/icon-copy.svg" alt="" onClick={onCopyWallet} />
        </div>
      </TableCell>
      <TableCell className={classes.tableCellTitle} component="td" scope="row">
        {user.signup?.toString().padStart(2, "0")}
      </TableCell>
      <TableCell className={classes.tableCellTitle} component="td" scope="row">
        {user.successful?.toString().padStart(2, "0")}
      </TableCell>
      <TableCell className={classes.tableCellTitle} component="td" scope="row">
        {user.earn_allocation}
      </TableCell>
      <TableCell className={classes.tableCellTitle} component="td" scope="row">
        {user.used_allocation}
      </TableCell>
      <TableCell className={classes.tableCellTitle} component="td" scope="row">
        {+user.earn_allocation - +user.used_allocation}
      </TableCell>

      <TableCell className={classes.tableCell} align="left">
        <div className={classes.btnView} onClick={handleViewHistory}>
          View
        </div>
      </TableCell>
    </TableRow>
  );
};

export default UserRecord;
