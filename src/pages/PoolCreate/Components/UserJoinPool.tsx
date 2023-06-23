import React from 'react';
import { useDispatch } from "react-redux";
import { Button } from "@material-ui/core";
import useStyles from "../style";
import UserParticipant from "./UserWinner/UserParticipant";
import UserWinner from "./UserWinner/UserWinner";

import {Tabs} from 'antd';
import UserBuyer from "./UserWinner/UserBuyer";
import PublicWinnerSetting from "./UserWinner/PublicWinnerSetting";
import { exportWinner } from "../../../request/participants";

const { TabPane } = Tabs;
function callback(key: any) {
  console.log(key);
}

const UserJoinPool = (props: any) => {
  const classes = useStyles();
  const {
    setValue, errors, control,
    poolDetail,
  } = props;

  const dispatch = useDispatch();

  return (
    <>
      <Tabs defaultActiveKey="1" onChange={callback}
        style={{
          minHeight: 500
        }}
      >
        <TabPane tab="Participant" key="1">
          <UserParticipant poolDetail={poolDetail} />
        </TabPane>
        <TabPane tab="Winner" key="2">
          <div style={{
            paddingBottom: 20
          }}>
            <Button
              variant="contained"
              color="primary"
              style={{ marginLeft: '10px' }}
              onClick={()=>exportWinner(poolDetail.id)}
            >Export Winner</Button>
          </div>
          <div style={{
            paddingBottom: 20
          }}>
            <PublicWinnerSetting
              poolDetail={poolDetail}
              setValue={setValue}
              errors={errors}
              control={control}
            />
          </div>
          <UserWinner poolDetail={poolDetail} />

        </TabPane>
        {/* <TabPane tab="Buyer" key="3">
          <UserBuyer poolDetail={poolDetail} />
        </TabPane> */}
      </Tabs>
    </>
  );
};

export default UserJoinPool;
