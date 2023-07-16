import React from 'react';
import { MenuItem, Select } from "@material-ui/core";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import { useCommonStyle } from "../../../../styles";
import { getFCFSUser } from "../../../../request/participants";
import useGetList from "../hooks/useGetList";
import Pagination from "@material-ui/lab/Pagination";
import useStylesTable from './style_table';
import { etherscanRoute } from "../../../../utils";
import Link from "@material-ui/core/Link";
import useMapMaxBuyTier from "../hooks/useMapMaxBuyTier";
import BigNumber from "bignumber.js";
import { POOL_IS_PRIVATE } from "../../../../constants";

function UserFCFS(props: any) {
    const commonStyle = useCommonStyle();
    const classesTable = useStylesTable();
    const { poolDetail } = props;
    const {
        rows,
        search, searchDelay,
        failure, loading,
        lastPage, currentPage, totalRecords,
        handlePaginationChange,
        status,
        setStatus
    } = useGetList({ poolDetail, handleSearchFunction: getFCFSUser });


    const {
        maxBuyTiersMapping,
        minBuyTiersMapping,
    } = useMapMaxBuyTier({ poolDetail });

    const STATUS = ['false', 'true']

    return (
        <div className={commonStyle.boxSearch}>
            <input className={commonStyle.inputSearch} onChange={searchDelay} placeholder="Search" />
            <img src="/images/icon-search.svg" alt="" style={{ marginLeft: -30 }} />

            {(poolDetail.is_private === POOL_IS_PRIVATE.COMMUNITY || poolDetail.is_private === POOL_IS_PRIVATE.EVENT) &&
                <Select
                    name="status"
                    value={status}
                    style={{ marginLeft: 30 }}
                    onChange={(e: any) => setStatus(e.target.value)}
                >
                    <MenuItem value={-1}>
                        All Status
                    </MenuItem>
                    {
                        STATUS.map((value, index) => {
                            return (
                                <MenuItem
                                    key={index}
                                    value={index}
                                >
                                    {value}
                                </MenuItem>
                            )
                        })
                    }
                </Select>
            }

            <TableContainer component={Paper} className={`${commonStyle.tableScroll} ${classesTable.tableUserJoin}`}>
                <Table className={classesTable.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Wallet Address</TableCell>
                            <TableCell align="center">Ticket</TableCell>
                            <TableCell align="center">Snapshot Points</TableCell>
                            <TableCell align="center">Level</TableCell>
                            <TableCell align="center">Min Buy</TableCell>
                            <TableCell align="center">Max Buy</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row: any, index: number) => (
                            <TableRow key={row.id}>

                                <TableCell align="center">
                                    <Link href={etherscanRoute(row.wallet_address, poolDetail)} target={'_blank'}>
                                        {row.wallet_address}
                                    </Link>
                                </TableCell>

                                <TableCell align="center" component="th" scope="row">
                                    {row.lottery_ticket || 0}
                                </TableCell>
                                <TableCell align="center" component="th" scope="row">
                                    {row.total_points}
                                </TableCell>
                                <TableCell align="center" component="th" scope="row">
                                    {row.level || 0}
                                </TableCell>

                                <TableCell align="center" component="th" scope="row">
                                    {minBuyTiersMapping[row.level || 0]}
                                </TableCell>
                                <TableCell align="center" component="th" scope="row">
                                    {new BigNumber(maxBuyTiersMapping[row.level || 0]).multipliedBy(row.lottery_ticket || 0).toFixed(2)}
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {failure && <p className={classesTable.errorMessage}>{failure}</p>}
                {!failure &&
                    ((!rows || rows.length === 0) && !loading) ? <p className={classesTable.noDataMessage}>There is no data</p> : (
                    <>
                        {rows && lastPage > 1 && <Pagination page={currentPage} className={classesTable.pagination} count={lastPage} onChange={handlePaginationChange} />}
                    </>
                )
                }
            </TableContainer>
        </div>
    );
}

export default UserFCFS;
