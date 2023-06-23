import { TableCell, TableRow } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import useComponentVisible from "../../../hooks/useComponentVisible";
import { adminRoute } from "../../../utils";
import { trimMiddlePartAddress } from "../../../utils/contractAddress/getAddresses";
import useStyles from "../style";

type HistoryProps = {
  friend_wallet: string;
  staking_status: number;
  is_kyc: number;
  onboarding_date: string | null;
  allocation: number;
  ref_user_status: number;
  pool_ido: string | null;
};

type HistoryRecordProps = {
  index: number;
  referral: HistoryProps;
};

const HistoryRecord: React.FC<HistoryRecordProps> = (
  props: HistoryRecordProps
) => {
  const { referral, index } = props;
  const classes = useStyles();

  const { ref } = useComponentVisible();

  return (
    <TableRow ref={ref} className={classes.tableRow} key={index}>
      <TableCell className={classes.tableCellTitle} component="td" scope="row">
        {index}
      </TableCell>
      <TableCell className={classes.tableCellTitle} component="td" scope="row">
        {trimMiddlePartAddress(referral.friend_wallet, 5)}
      </TableCell>
      <TableCell className={classes.tableCellTitle} component="td" scope="row">
        {referral.staking_status ? (
          <div className={classes.status}>
            <img src="/images/tick.svg" alt="" />
            <span className="success">Successful</span>
          </div>
        ) : (
          <div className={classes.status}>
            <img src="/images/pending.svg" alt="" />
            <span className="pending">Pending</span>
          </div>
        )}
      </TableCell>
      <TableCell className={classes.tableCellTitle} component="td" scope="row">
        {referral.onboarding_date || "N/A"}
      </TableCell>
      <TableCell className={classes.tableCellTitle} component="td" scope="row">
        ${referral.allocation || "0"}
      </TableCell>
      <TableCell className={classes.tableCellTitle} component="td" scope="row">
        {referral.pool_ido || "N/A"}
      </TableCell>
    </TableRow>
  );
};

export default HistoryRecord;
