import React from 'react';
import { TableCell, TableRow, Tooltip, Button } from '@material-ui/core';
import useComponentVisible from '../../../hooks/useComponentVisible';
//@ts-ignore
import {CopyToClipboard} from 'react-copy-to-clipboard';
//@ts-ignore
import { NotificationManager } from 'react-notifications';
import moment from 'moment';

import useStyles from './style';

type UserProps = {
  id: string;
  email: string;
  user_telegram?: string;
  wallet_address: string;
  is_kyc: number;
  address_country: string;

  tier?: number;
  staked_point?: string;
  bonus_point?: string;
  total_point?: string;
  updated_at?: number | null;
}

type UserRowProps = {
  user: UserProps;
  getUserListInfo: any;
}

const UserRecord: React.FC<UserRowProps> = (props: UserRowProps) => {
  const { user } = props;
  const classes = useStyles();
  const { ref } =  useComponentVisible();

  const maskWalletAddress = (wallet: string) => {
    const preWalletLength = wallet.length;

    let r = wallet.slice(5, preWalletLength-5);
    wallet = wallet.replace(r, "*****");

    return wallet;
  };

  const stringifyTier = (tier: any) => {
    switch(tier) {
      case 1:
        return '1';
      case 2:
        return '2';
      case 3:
        return '3';
      case 4:
        return '4';
      default:
        return '0';
    }
  }

  return (
    <>
      <TableRow
        ref={ref} className={classes.tableRow} key={user.id}
      >
        <TableCell className={classes.tableCell} align="left">
          <Tooltip title={<p style={{ fontSize: 15 }}>{user.wallet_address}</p>}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <span>
                {maskWalletAddress(user.wallet_address)}
              </span>
              <CopyToClipboard onCopy={() => NotificationManager.success("Copied")} text={user.wallet_address}>
                <Button style={{minWidth: '20px'}}><img src="/images/icon-copy.svg" alt="" style={{maxHeight: '18px'}}/></Button>
              </CopyToClipboard>
            </div>
          </Tooltip>
        </TableCell>

        <TableCell className={classes.tableCell} align="left">
          <strong>{user.total_point}</strong>
        </TableCell>

        <TableCell className={classes.tableCell} align="left">
          {stringifyTier(user.tier)}
        </TableCell>

        <TableCell className={classes.tableCell} align="left">
          {
            user.email &&
            <Tooltip title={<p style={{ fontSize: 15 }}>{user.email}</p>}>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <span className={classes.wordBreak}>{user.email}</span>
                <CopyToClipboard onCopy={() => NotificationManager.success("Copied")} text={user.email}>
                  <Button style={{minWidth: '20px'}}><img src="/images/icon-copy.svg" alt="" style={{maxHeight: '18px'}}/></Button>
                </CopyToClipboard>
              </div>
            </Tooltip>
          }
        </TableCell>

        <TableCell className={classes.tableCell} align="left">
          <>
          {
            user.user_telegram &&
            <Tooltip title={<p style={{ fontSize: 15 }}>{user.user_telegram}</p>}>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <span>{user.user_telegram}</span>
                <CopyToClipboard onCopy={() => NotificationManager.success("Copied")} text={user.user_telegram}>
                  <Button style={{minWidth: '20px'}}><img src="/images/icon-copy.svg" alt="" style={{maxHeight: '18px'}}/></Button>
                </CopyToClipboard>
              </div>
            </Tooltip>
          }
          </>
        </TableCell>

        <TableCell className={classes.tableCell} align="left">

          {user.updated_at ? moment(user.updated_at, 'YYYY-MM-DD HH:mm:ss').format("HH:mm DD/MM") : 'null'}
        </TableCell>

      </TableRow>
    </>
  )

};

export default UserRecord;
