import {
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Pagination from "@material-ui/lab/Pagination";
import Skeleton from "@material-ui/lab/Skeleton";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Transition from "../../../components/Base/Transition";
import { months, onboardStatus, ONBOARD_STATUS } from "../../../constants";
import { getReferralHistory } from "../../../request/referrals";
import { alertFailure, alertSuccess } from "../../../store/actions/alert";
import { getListReferral } from "../../../store/actions/referrals";
import { useCommonStyle } from "../../../styles";
import { trimMiddlePartAddress } from "../../../utils/contractAddress/getAddresses";
import useStyles from "../style";
import HistoryRecord from "./HistoryRecord";

const tableHeaders = [
  "No",
  "Friend Wallet",
  "Onboarding Status",
  "Onboarding Date",
  "Earned Allocation",
  "Status",
  "Pool IDO",
];
const TabAllUsers: React.FC<any> = (props: any) => {
  const classes = useStyles();
  const commonStyle = useCommonStyle();
  const dispatch = useDispatch();
  const { show, close, walletHistory } = props;

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [histories, setHistories] = useState<any[]>([]);
  const [sortEarnAllocation, setSortEarnAllocation] = useState<boolean>(true);
  const [filter, setFilter] = useState<{
    search: string;
    month: number;
    status: typeof ONBOARD_STATUS[keyof typeof ONBOARD_STATUS];
  }>({
    search: "",
    month: 0,
    status: ONBOARD_STATUS.ALL,
  });

  const handleFilter = () => {
    let query = `wallet_address=${walletHistory}&sort_field=earn_allocation&sort_type=${
      sortEarnAllocation ? "asc" : "desc"
    }`;
    if (!!filter.search) query += `&friend_address=${filter.search}`;
    if (!!+filter.month) query += `&month=${filter.month}`;
    if (+filter.status !== ONBOARD_STATUS.ALL)
      query += `&onboadrding_status=${
        +filter.status === ONBOARD_STATUS.SUCCESSFULL ? "true" : "false"
      }`;
    setLoading(true);
    getReferralHistory(query)
      .then(async (res) => {
        if (res.status !== 200) {
          dispatch(
            alertFailure(
              "Server Error: " + (res.message || "Load history fail !!!")
            )
          );
          return false;
        }
        let data = res.data;

        setHistories(data.data);
        setCurrentPage(data.page);
        setLastPage(data.lastPage);
        setLoading(false);

        return data;
      })
      .catch((e) => {
        console.log("Error: ", e);
        dispatch(alertFailure("History load fail !!!"));
        setLoading(false);
      });
  };

  useEffect(() => {
    const timerFilter = setTimeout(handleFilter, 500);
    return () => clearTimeout(timerFilter);
  }, [walletHistory, filter, currentPage, sortEarnAllocation]);

  const handlePaginationChange = (event: any, page: number) => {
    setCurrentPage(page);
  };
  const onCopyWallet = () => {
    navigator.clipboard.writeText(walletHistory);
    dispatch(alertSuccess("Wallet Address Copied!"));
  };

  const onSearch = (e: any) => {
    setFilter({
      ...filter,
      search: e.target.value,
    });
  };
  const handleChangeMonth = (e: any) => {
    setFilter({
      ...filter,
      month: e.target.value,
    });
  };
  const handleChangeStatus = (e: any) => {
    setFilter({
      ...filter,
      status: e.target.value,
    });
  };
  const handleSortEarnedAllocation = () => {
    setSortEarnAllocation((prevState) => !prevState);
  };

  return (
    <>
      <Dialog
        open={show}
        TransitionComponent={Transition}
        aria-labelledby="form-dialog-title"
        fullWidth
        maxWidth="lg"
        className={classes.dialog}
      >
        <DialogTitle id="form-dialog-title">
          <div className={classes.dialogTitle}>
            <span className="title">Wallet Address: </span>
            <span className="wallet">
              {trimMiddlePartAddress(walletHistory)}
            </span>
            <img
              src="images/icon-copy.svg"
              alt=""
              className="icon-copy"
              onClick={onCopyWallet}
            />
            <img
              src="images/icon_close.svg"
              alt=""
              className="icon-close"
              onClick={close}
            />
          </div>
          <div className={classes.filterBar}>
            <span className="title">Referral History</span>
            <Select
              className={classes.selectBox}
              native
              IconComponent={ExpandMoreIcon}
              value={filter.month}
              style={{ marginLeft: "auto" }}
              onChange={handleChangeMonth}
              inputProps={{
                name: "type",
                id: "list-months",
              }}
            >
              {months?.map((item: any, index: number) => {
                return (
                  <option value={item.value} key={index}>
                    {item.label}
                  </option>
                );
              })}
            </Select>
            <Select
              className={classes.selectBox}
              native
              IconComponent={ExpandMoreIcon}
              value={filter.status}
              onChange={handleChangeStatus}
              inputProps={{
                name: "type",
                id: "list-status",
              }}
            >
              {onboardStatus?.map((item: any, index: number) => {
                return (
                  <option value={item.value} key={index}>
                    {item.label}
                  </option>
                );
              })}
            </Select>
            <div className={commonStyle.boxSearch}>
              <input
                className={commonStyle.inputSearch}
                onChange={onSearch}
                placeholder="Seach by wallet address"
              />
              <img
                className={commonStyle.iconSearch}
                src="/images/icon-search.svg"
                alt=""
              />
            </div>
          </div>
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <TableContainer component={Paper} className={classes.tableContainer}>
            {loading ? (
              [...Array(5)].map((num, index) => (
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
                        {index === 4 && (
                          <img
                            src="/images/icon-sort.svg"
                            alt=""
                            onClick={handleSortEarnedAllocation}
                          />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody className={classes.tableBody}>
                  {histories &&
                    histories.length > 0 &&
                    histories.map((user: any, index: number) => (
                      <HistoryRecord
                        key={index}
                        index={index + 1}
                        referral={user}
                      />
                    ))}
                </TableBody>
              </Table>
            )}
            {(!histories || histories.length === 0) && !loading ? (
              <p className={classes.noDataMessage}>There is no data</p>
            ) : (
              <>
                {histories && lastPage > 1 && (
                  <Pagination
                    page={currentPage}
                    className={classes.pagination}
                    count={lastPage}
                    onChange={handlePaginationChange}
                  />
                )}
              </>
            )}
          </TableContainer>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default TabAllUsers;
