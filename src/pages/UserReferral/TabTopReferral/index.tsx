import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pickTopReferral } from "../../../request/referrals";
import { alertFailure, alertSuccess } from "../../../store/actions/alert";
import { getTopReferral } from "../../../store/actions/referrals";
import useStyles from "../style";
import TopRefRecord from "./TopRefRecord";

const tableHeaders = [
  "Wallet Address",
  "Month",
  "Sucessful Referrals",
  "Rewards",
  "Actions",
];
const TabTopReferral: React.FC<any> = (props: any) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { showTab, search = "" } = props;
  const { data: topUsers } = useSelector(
    (state: any) => state.referralTop.data
  );
  const { loading: loadingListTop, failure } = useSelector(
    (state: any) => state.referralTop
  );
  const [isPicking, setIsPicking] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getTopReferral(search));
  }, [dispatch, search, reload]);

  const handlePickTop = async () => {
    setIsPicking(true);
    let toDay = moment().format("DD/MM/YYYY");
    let query = `date=${toDay}`;

    try {
      const response: any = await pickTopReferral(query);
      if (response?.status === 200) {
        dispatch(alertSuccess("Successful!"));
        setReload((prev) => !prev);
      } else {
        dispatch(alertFailure("Fail!"));
      }
      setIsPicking(false);
    } catch (e) {
      setIsPicking(false);
      console.log("ERROR: ", e);
    }
  };

  return (
    <div
      style={{ display: showTab ? "flex" : "none", flexDirection: "column" }}
    >
      <button
        className={classes.btnView}
        style={{ marginTop: 12 }}
        onClick={handlePickTop}
        disabled={isPicking}
      >
        <span>Pick Top Referrers</span>
        {isPicking && (
          <CircularProgress
            size={16}
            style={{ marginLeft: 10 }}
            color="inherit"
          />
        )}
      </button>

      <TableContainer component={Paper} className={classes.tableContainer}>
        {loadingListTop ? (
          [...Array(10)].map((num, index) => (
            <div key={index}>
              <Skeleton className={classes.skeleton} width={"100%"} />
            </div>
          ))
        ) : (
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {tableHeaders.map((tableHeader: string, index: number) => (
                  <TableCell key={index} className={classes.tableHeader}>
                    {tableHeader}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody className={classes.tableBody}>
              {topUsers &&
                topUsers.length > 0 &&
                topUsers.map((user: any, index: number) => (
                  <TopRefRecord key={index} user={user} setReload={setReload} />
                ))}
            </TableBody>
          </Table>
        )}
        {(!topUsers || topUsers.length === 0) && !loadingListTop && (
          <p className={classes.noDataMessage}>There is no data</p>
        )}
      </TableContainer>
    </div>
  );
};
export default TabTopReferral;
