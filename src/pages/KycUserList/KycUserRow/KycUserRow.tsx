import React, {useEffect} from 'react';
import {TableCell, TableRow, Tooltip} from '@material-ui/core';
import useComponentVisible from '../../../hooks/useComponentVisible';
import { Link, useHistory } from 'react-router-dom';
import { Button } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { alertSuccess, alertFailure } from "../../../store/actions/alert";
import { deleteKYCUser } from "../../../request/kyc-user"

import useStyles from './style';
import {adminRoute} from "../../../utils";

const KycUserRow: React.FC<any> = (props: any) => {
  const { admin, currentOpen, setCurrentOpen, countries, getAdminListInfo } = props;
  const classes = useStyles();
  const { ref, isVisible, setIsVisible } = useComponentVisible();
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    currentOpen && setCurrentOpen("");
  }, [admin]);

  useEffect(() => {
    setIsVisible(admin.id === currentOpen);
  }, [currentOpen]);

  const getActiveStatus = (admin: any) => {
    switch (admin.is_kyc) {
      case 0:
        return 'Unapproved';
      case 1:
        return 'Approved';
    }

    return '';
  };

  const handleDeleteUser = async () => {
    if (!window.confirm('Do you want delete this item?')) {
      return false;
    }
    const res = await deleteKYCUser(admin.id)

    if (res.status ===200) {
      dispatch(alertSuccess('Delete account Success'))
      await getAdminListInfo()
    } else {
      dispatch(alertFailure('Delete account failed'))
    }
  }

  return (
    <TableRow ref={ref} className={classes.tableRow} key={admin.id} onClick={() => history.push(adminRoute(`/kyc-user-detail/${admin.id}`))}>
      <TableCell className={classes.tableCell} align="left">
        {admin.id}
      </TableCell>

      <TableCell className={classes.tableCellTitle} component="td" scope="row">
        <Tooltip title={<p style={{ fontSize: 15 }}>{admin.email}</p>}>
              <span className={classes.wordBreak}>
                {admin.email}
              </span>
        </Tooltip>
      </TableCell>

      <TableCell className={classes.tableCell} align="left">
        <Tooltip title={<p style={{ fontSize: 15 }}>{admin.wallet_address}</p>}>
              <span className={classes.wordBreak}>
                {admin.wallet_address}
              </span>
        </Tooltip>
      </TableCell>

      {/* COUNTRY */}
      <TableCell className={classes.tableCellTitle} component="td" scope="row">
        <Tooltip title={<p style={{ fontSize: 15 }}>{admin?.national_id_issuing_country}</p>}>
              <span className={classes.wordBreak} style={{ width: 200 }}>
                {
                  countries[admin?.national_id_issuing_country || ''] || ''
                }
                <br/>
                {
                  admin?.national_id_issuing_country &&
                  <span>({admin?.national_id_issuing_country})</span>
                }
              </span>
        </Tooltip>
      </TableCell>



      <TableCell className={classes.tableCell} align="left">
        <div className={classes.tableCellFlex}>

          <div className="left">
            <Tooltip title={<p style={{ fontSize: 15 }}>{getActiveStatus(admin)}</p>}>
              <span className={`admin-status admin-${getActiveStatus(admin).toLowerCase()}`}>
              </span>
            </Tooltip>
            {getActiveStatus(admin)}
          </div>

        </div>
      </TableCell>


      <TableCell className={classes.tableCell} align="left" >
        <Button
          variant="contained"
          color="secondary"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteUser()
          }}
        >Delete</Button>
      </TableCell>

    </TableRow>
  )

};

export default KycUserRow;
