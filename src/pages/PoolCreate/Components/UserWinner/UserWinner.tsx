import { Tabs } from 'antd';
import TableWinner from "./TableWinner";
import TableReferral from './TableReferral';
import React from 'react';
const { TabPane } = Tabs;

function callback(key: any) {
  console.log(key);
}

function UserWinner(props: any) {
  const { poolDetail } = props;

  return (
    <>
      <div>
        <Tabs defaultActiveKey="1" onChange={callback}
          style={{
            minHeight: 500
          }}
        >
          <TabPane tab="Winner" key="1">
            <TableWinner poolDetail={poolDetail} />
          </TabPane>
          {/* <TabPane tab="Referral" key="2">
            <TableReferral poolDetail={poolDetail} />
          </TabPane> */}
        </Tabs>
      </div>

    </>
  );
}

export default UserWinner;
