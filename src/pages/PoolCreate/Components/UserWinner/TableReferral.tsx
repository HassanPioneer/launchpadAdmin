import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Pagination from "@material-ui/lab/Pagination";
import React, { useEffect, useState } from "react";
import { POOL_IS_PRIVATE } from "../../../../constants";
import { getWinnerReferrals } from "../../../../request/referrals";
import { useCommonStyle } from "../../../../styles";
import { etherscanRoute } from "../../../../utils";
import useGetList from "../hooks/useGetList";
import useStylesTable from "./style_table";

function TableReferral(props: any) {
  const commonStyle = useCommonStyle();
  const classesTable = useStylesTable();
  const { poolDetail } = props;
  const {
    rows,
    search,
    searchDelay,
    failure,
    loading,
    lastPage,
    currentPage,
    totalRecords,
    handlePaginationChange,
    status,
    setStatus,
  } = useGetList({ poolDetail, handleSearchFunction: getWinnerReferrals });

  console.log(rows);

  const [totalAllocation, setTotalAllocation] = useState<number>(0);

  useEffect(() => {
    if (!rows || rows?.length === 0) return;

    let totalAlloc = rows.reduce(
      (prev: any, current: any) => prev + +current.allocation,
      0
    );
    console.log(totalAlloc);
    setTotalAllocation(totalAlloc);
  }, [rows]);

  return (
    <div className={commonStyle.boxSearch}>
      <input
        className={commonStyle.inputSearch}
        onChange={searchDelay}
        placeholder="Search"
      />
      <img src="/images/icon-search.svg" alt="" style={{ marginLeft: -30 }} />

      <TableContainer
        component={Paper}
        className={`${commonStyle.tableScroll} ${classesTable.tableUserJoin}`}
        style={{ minHeight: 160 }}
      >
        <Table className={classesTable.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell align="center">Wallet Address</TableCell>
              {(poolDetail.is_private === POOL_IS_PRIVATE.COMMUNITY || poolDetail.is_private === POOL_IS_PRIVATE.EVENT) ? (
                <TableCell align="center">Status</TableCell>
              ) : (
                <div></div>
              )}
              <TableCell align="center">Allocation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: any, index: number) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.email}
                </TableCell>

                <TableCell align="center">
                  <Link
                    href={etherscanRoute(row.wallet_address, poolDetail)}
                    target={"_blank"}
                  >
                    {row.wallet_address}
                  </Link>
                </TableCell>

                {(poolDetail.is_private === POOL_IS_PRIVATE.COMMUNITY || poolDetail.is_private === POOL_IS_PRIVATE.EVENT) ? (
                  <TableCell align="center" component="th" scope="row">
                    {row.status ? "true" : "false"}
                  </TableCell>
                ) : (
                  <div></div>
                )}

                <TableCell align="center" component="th" scope="row">
                  {row.allocation || 0}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {failure && <p className={classesTable.errorMessage}>{failure}</p>}
        {!failure && (!rows || rows.length === 0) && !loading ? (
          <p className={classesTable.noDataMessage}>There is no data</p>
        ) : (
          <>
            {rows && lastPage > 1 && (
              <Pagination
                page={currentPage}
                className={classesTable.pagination}
                count={lastPage}
                onChange={handlePaginationChange}
              />
            )}
          </>
        )}
      </TableContainer>
      <div className={classesTable.totalAllocation}>
        <b className="label">Total Allocation:</b>
        <b>{totalAllocation}</b>
      </div>
    </div>
  );
}

export default TableReferral;
