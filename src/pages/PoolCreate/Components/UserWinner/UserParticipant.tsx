import React, {useEffect, useState} from 'react';
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {Button} from "@material-ui/core";
import {useCommonStyle} from "../../../../styles";
import {
  getParticipantUser,
  exportParticipants,
} from "../../../../request/participants";
import {useDispatch} from "react-redux";
import {withRouter} from "react-router";
import {alertFailure, alertSuccess} from "../../../../store/actions/alert";
import useGetList from "../hooks/useGetList";
import UserPickerToWinner from "./UserPickerToWinner";
import UserWhitelistSubmissionPopup from "./UserWhitelistSubmissionPopup";
import {Checkbox} from 'antd';
import {cloneDeep, filter, includes, set} from 'lodash';
import Pagination from "@material-ui/lab/Pagination";
import useStylesTable from './style_table';
import {BUY_TYPE} from "../../../../constants";
import {etherscanRoute} from "../../../../utils";
import {importParticipants} from "../../../../request/pool";
import Link from '@material-ui/core/Link';

function UserParticipant(props: any) {
  const commonStyle = useCommonStyle();
  const classesTable = useStylesTable();
  const { poolDetail } = props;
  const dispatch = useDispatch();
  const [whitelistPendingOnly, setWhitelistPendingOnly] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [importResponse, setImportResponse] = useState('');

  const getParticipantUserWithTier = async (poolId: any, searchParams: any) => {
    try {
      let participantsUsers = await getParticipantUser(poolId, {...searchParams, whitelist_pending: whitelistPendingOnly});

      if (poolDetail.buy_type === BUY_TYPE.FCFS) {
        return participantsUsers;
      }

      // return participantsUsers;

      // Call Multi get Tiers
      let users = participantsUsers?.data?.data || [];

      // calculate submission status
      for (let i = 0; i < users.length; i++) {
        const listStatuses = [
          users[i]?.whitelistSubmission?.partner_twitter_status,
          users[i]?.whitelistSubmission?.partner_channel_status,
          users[i]?.whitelistSubmission?.partner_group_status,
          users[i]?.whitelistSubmission?.partner_retweet_post_status,
          users[i]?.whitelistSubmission?.self_twitter_status,
          users[i]?.whitelistSubmission?.self_channel_status,
          users[i]?.whitelistSubmission?.self_group_status,
          users[i]?.whitelistSubmission?.self_retweet_post_status,
        ];

        if (!(listStatuses.includes(0) || listStatuses.includes(2) || listStatuses.includes(3))) {
          users[i].whitelistStatus = 'Completed';
          continue;
        }

        users[i].whitelistStatus = 'Pending';
      }

      participantsUsers.data.data = users;
      return participantsUsers;
    } catch (e) {
      console.log('ERROR: Fail fill Tiers!!!');
      console.log(e);
    }
  };

  const {
    rows,
    search, searchDelay,
    failure, loading,
    lastPage, currentPage, totalRecords, setCurrentPage,
    handlePaginationChange,
  } = useGetList({
    poolDetail,
    handleSearchFunction: getParticipantUserWithTier
  });

  const [addedUsers, setAddedUsers] = useState([]);

  const [isOpenWhitelistPopup, setIsOpenWhitelistPopup] = useState(false);
  const [selectedWhitelistSubmission, setSelectedWhitelistSubmission] = useState({});
  const openWhitelistPopup = (e: any, row: any, index: number) => {
    setSelectedWhitelistSubmission(row?.whitelistSubmission);
    setIsOpenWhitelistPopup(true);
  };

  const onCheckToAdd = (e: any, row: any, index: number) => {
    console.log('[onCheckToAdd]: ', e.target.value, row, index);
    const isChecked = e.target.checked;
    let newArr = cloneDeep(addedUsers);
    if (isChecked) {
      // @ts-ignore
      newArr.push(row.wallet_address);
    } else {
      newArr = filter(newArr, (it) => row.wallet_address != it);
    }
    onChange(newArr);
  };

  const [indeterminate, setIndeterminate] = React.useState(false);
  const [checkAll, setCheckAll] = React.useState(false);
  const onChange = (list: any) => {
    setAddedUsers(list);
    setIndeterminate(!!list.length && list.length < rows.length);
    setCheckAll(list.length === rows.length);
  };

  const onCheckAllChange = (e: any) => {
    setAddedUsers(e.target.checked ? addedUsers : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);

    if (e.target.checked) {
      // @ts-ignore
      setAddedUsers(rows.map(it => it.wallet_address));
    } else {
      setAddedUsers([]);
    }
  };

  useEffect(()=>{
    if (currentPage !== 1) {
      setCurrentPage(1);
      return;
    }
    search();
  }, [whitelistPendingOnly])


  const handleSelectCSVFile = (e: any) => {
    setSelectedFile(e.target.files[0]);
  }

  const handleImportCSV = async () => {
    setImportResponse('');
    const res = await importParticipants(poolDetail.id, selectedFile)
    dispatch((res.status === 200 ? alertSuccess : alertFailure)(res.message));
    if (res.status === 200) {
      setImportResponse(`Total: ${res.data?.total} --- Added: ${res.data?.added} --- Invalid: ${res.data?.invalid} --- Duplicated: ${res.data?.duplicated}`);
    }
  }

  return (
    <>
      <div className={commonStyle.boxSearch} style={{display: 'flex'}}>
        <Grid item xs={6} style={{ display: 'inline-block' }}>
          <input
            color="primary"
            type="file"
            accept=".csv, .xlsx"
            onChange={handleSelectCSVFile}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleImportCSV}
          >Import participants</Button>
        </Grid>

        <Button
          variant="contained"
          color="primary"
          style={{ marginLeft: 'auto'}}
          onClick={()=>exportParticipants(poolDetail.id)}
        >Export participants</Button>
      </div>
      <div className={commonStyle.boxSearch}>
        {importResponse ? <p>{importResponse}</p> : <p></p>}
      </div>

      <div className={commonStyle.boxSearch} style={{display: 'flex', justifyContent: 'space-between', marginTop: 20, marginBottom: 10 }}>
        <input className={commonStyle.inputSearch} onChange={searchDelay} placeholder="Search" />
        <img src="/images/icon-search.svg" alt="" style={{ marginLeft: -30 }} />

        <div style={{ paddingLeft: 80, display: 'inline-block'}}>
          <UserPickerToWinner
            poolDetail={poolDetail}
          />
        </div>
      </div>

      {isOpenWhitelistPopup &&
        <UserWhitelistSubmissionPopup
          isOpenEditPopup={isOpenWhitelistPopup}
          setIsOpenEditPopup={setIsOpenWhitelistPopup}
          editData={selectedWhitelistSubmission}
          requirements={poolDetail.socialRequirement}
        />
      }

      <TableContainer component={Paper} className={`${commonStyle.tableScroll} ${classesTable.tableUserJoin}`}>
        <Table className={classesTable.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              {/* <TableCell size={'small'}>
                <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                  Check all
                </Checkbox>
              </TableCell> */}
              <TableCell size={'small'}>Email</TableCell>
              <TableCell align="center" size={'medium'}>Wallet Address</TableCell>
              <TableCell align="center">Tier</TableCell>
              <TableCell align="center">Cached Points</TableCell>
              {/* <TableCell align="right">Whitelist Submission</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: any, index: number) => (
              <TableRow key={row.id}>
                {/* <TableCell size={'small'}>
                  <Checkbox
                    onChange={(e) => onCheckToAdd(e, row, index)}
                    checked={includes(addedUsers, row.wallet_address)}
                  ></Checkbox>
                </TableCell> */}

                <TableCell component="th" scope="row" size={'small'}>{row.email}</TableCell>
                <TableCell align="center" size={'medium'}>
                  <Link href={etherscanRoute(row.wallet_address, poolDetail)} target={'_blank'}>
                    {row.wallet_address}
                  </Link>
                </TableCell>
                <TableCell align="center">
                    {row.tier}
                </TableCell>
                <TableCell align="center">
                    {row.total_point}
                </TableCell>
                {/* <TableCell component="th" scope="row" size={'small'} align="right">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) => openWhitelistPopup(e, row, index)}
                    style={{marginLeft: 10, marginTop: 10, backgroundColor: row.whitelistStatus === 'Completed' ? '#4caf50' : '#3f51b5'}}
                  >{row.whitelistStatus}</Button>

                </TableCell> */}

                {/*<TableCell align="right">*/}
                {/*  <Button*/}
                {/*    variant="contained"*/}
                {/*    color="secondary"*/}
                {/*    onClick={(e) => deleteItem(e, row, index)}*/}
                {/*    style={{marginLeft: 10, marginTop: 10}}*/}
                {/*  >Delete</Button>*/}
                {/*</TableCell>*/}

              </TableRow>
            ))}
          </TableBody>
        </Table>

        {failure && <p className={classesTable.errorMessage}>{failure}</p>}
        {!failure &&
          ((!rows || rows.length === 0) && !loading)  ? <p className={classesTable.noDataMessage}>There is no data</p> : (
            <>
              {rows && lastPage > 1 && <Pagination page={currentPage} className={classesTable.pagination} count={lastPage} onChange={handlePaginationChange} />}
            </>
          )
        }
      </TableContainer>
    </>
  );
}

export default withRouter(UserParticipant);
