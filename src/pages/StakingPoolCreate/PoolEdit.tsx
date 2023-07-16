import React, {useEffect, useState} from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import DefaultLayout from '../../components/Layout/DefaultLayout';
import {adminRoute} from "../../utils";
import PoolForm from "./PoolForm";
import {getPoolDetail} from "../../request/staking-pool";
import BackButton from "../../components/Base/ButtonLink/BackButton";
import {useDispatch} from "react-redux";
import {alertFailure} from "../../store/actions/alert";

const PoolEdit: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
  const isEdit = true;
  const { match } = props;
  const dispatch = useDispatch();
  const [poolDetail, setPoolDetail] = useState();

  // @ts-ignore
  const id = match.params?.id;

  useEffect(() => {
    getPoolDetail(id)
      .then(async (res) => {
        if (res.status !== 200) {
          dispatch(alertFailure('Server Error: ' + (res.message || 'Load pool fail !!!')));
          return false;
        }
        const data = res.data;

        setPoolDetail(data);

        return res.data;
      })
      .catch((e) => {
        console.log('Error: ', e);
        dispatch(alertFailure('Pool load fail !!!'));
      });
  }, [id]);

  return (
    <DefaultLayout>
      <BackButton to={adminRoute('/campaigns')}/>
      <PoolForm
        isEdit={isEdit}
        poolDetail={poolDetail}
      />
    </DefaultLayout>
  )
}

export default withRouter(PoolEdit);
