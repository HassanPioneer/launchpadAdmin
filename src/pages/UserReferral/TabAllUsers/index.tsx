import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import Skeleton from "@material-ui/lab/Skeleton";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListReferral } from "../../../store/actions/referrals";
import HistoryDialog from "../HistoryDialog";
import useStyles from "../style";
import UserRecord from "./UserRecord";

const tableHeaders = [
  "Wallet Address",
  "Referral Signups",
  "Successful Referrals",
  "Earn Allocation",
  "Activated",
  "Inactive",
  "Detail",
];
const TabAllUsers: React.FC<any> = (props: any) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { showTab, search = "" } = props;
  const {
    page = 1,
    lastPage,
    data: allUsers,
  } = useSelector((state: any) => state.referralListAll.data);
  const { loading: loadingListAll, failure } = useSelector(
    (state: any) => state.referralListAll
  );
  const [currentPage, setCurrentPage] = useState<number>(page);
  const [showViewHistory, setShowViewHistory] = useState<boolean>(false);
  const [walletHistory, setWalletHistory] = useState<string>("");
  const [sortField, setSortField] = useState<
    "earn_allocation" | "successful" | null
  >(null);
  const [sortType, setSortType] = useState<{
    earn_allocation: boolean; // true = "asc", false = "desc"
    successful: boolean;
  }>({
    earn_allocation: true,
    successful: true,
  });

  useEffect(() => {
    let type = sortField
      ? sortType[sortField]
        ? "asc"
        : "desc"
      : (undefined as any);
    dispatch(getListReferral(currentPage, search, sortField, type));
  }, [dispatch, currentPage, search, sortField, sortType]);

  const viewUserRefHistory = (address: string) => {
    setShowViewHistory(true);
    setWalletHistory(address);
  };

  const handlePaginationChange = (event: any, page: number) => {
    setCurrentPage(page);
  };

  const handleSort = (index: number) => {
    // index of tableHeaders[]
    switch (index) {
      case 2:
        setSortField("successful");
        setSortType({
          ...sortType,
          successful: !sortType.successful,
        });
        break;
      case 3:
        setSortField("earn_allocation");
        setSortType({
          ...sortType,
          earn_allocation: !sortType.earn_allocation,
        });
        break;
      default:
        setSortField(null);
        break;
    }
  };

  return (
    <div style={{ display: showTab ? "inherit" : "none" }}>
      <TableContainer component={Paper} className={classes.tableContainer}>
        {loadingListAll ? (
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
                    {(index === 3 || index === 2) && (
                      <img
                        src="/images/icon-sort.svg"
                        alt=""
                        onClick={() => handleSort(index)}
                      />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody className={classes.tableBody}>
              {allUsers &&
                allUsers.length > 0 &&
                allUsers.map((user: any, index: number) => (
                  <UserRecord
                    key={index}
                    user={user}
                    viewUserRefHistory={viewUserRefHistory}
                  />
                ))}
            </TableBody>
          </Table>
        )}
        {failure ? (
          <p className={classes.errorMessage}>{failure}</p>
        ) : (!allUsers || allUsers.length === 0) && !loadingListAll ? (
          <p className={classes.noDataMessage}>There is no data</p>
        ) : (
          <>
            {allUsers && lastPage > 1 && (
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

      <HistoryDialog
        show={showViewHistory}
        walletHistory={walletHistory}
        close={() => setShowViewHistory(false)}
      />
    </div>
  );
};
export default TabAllUsers;
