import React, {useEffect, useState} from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import DefaultLayout from '../../components/Layout/DefaultLayout';
import {adminRoute} from "../../utils";
import PoolForm from "./PoolForm";
import {getPoolDetail} from "../../request/pool";
import moment from "moment";
import {DATETIME_FORMAT} from "../../constants";
import BackButton from "../../components/Base/ButtonLink/BackButton";
import {useDispatch} from "react-redux";
import {alertFailure} from "../../store/actions/alert";
import ButtonLink from '../../components/Base/ButtonLink';
import useStyles from './style';

const PoolEdit: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
  const isEdit = true;
  const { match } = props;
  const dispatch = useDispatch();
  const styles = useStyles();
  const [poolDetail, setPoolDetail] = useState({});

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
        const newData = {
          ...data,
          start_time: data?.start_time ? moment.unix(data?.start_time).format(DATETIME_FORMAT) : null,
          finish_time: data?.finish_time ? moment.unix(data?.finish_time).format(DATETIME_FORMAT) : null,
          release_time: data?.release_time ? moment.unix(data?.release_time).format(DATETIME_FORMAT) : null,
          start_join_pool_time: data?.start_join_pool_time ? moment.unix(data?.start_join_pool_time).format(DATETIME_FORMAT) : null,
          end_join_pool_time: data?.end_join_pool_time ? moment.unix(data?.end_join_pool_time).format(DATETIME_FORMAT) : null,
          announcement_time: data?.announcement_time ? moment.unix(data?.announcement_time).format(DATETIME_FORMAT) : null,
          start_pre_order_time: data?.start_pre_order_time ? moment.unix(data?.start_pre_order_time).format(DATETIME_FORMAT) : null,
          listing_time: data?.listing_time ? moment.unix(data?.listing_time).format(DATETIME_FORMAT) : null,
          start_refund_time: data?.start_refund_time ? moment.unix(data?.start_refund_time).format(DATETIME_FORMAT) : null,
          end_refund_time: data?.end_refund_time ? moment.unix(data?.end_refund_time).format(DATETIME_FORMAT) : null,
          first_time_claim_phase: data?.first_time_claim_phase ? moment.unix(data?.first_time_claim_phase).format(DATETIME_FORMAT) : null,
        };

        setPoolDetail(newData);

        // if (newData.is_deploy && newData.campaign_hash) {
        //   console.log('newData=======', newData);
        //   await getPoolInfoInBlockchain(newData);
        // }

        return res.data;
      })
      .catch((e) => {
        console.log('Error: ', e);
        dispatch(alertFailure('Pool load fail !!!'));
      });
  }, [id]);

  return (
    <DefaultLayout>
      <div className={styles.listButton}>
        <BackButton to={adminRoute('/campaigns')}/>
        <ButtonLink
          text='Clone Pool'
          to={{
            pathname: adminRoute('/campaigns/add'),
            state: {
              poolDetail: {...poolDetail, is_deploy: 0}
            }
          }}
          spacing={6}
        />
      </div>
      <PoolForm
        isEdit={isEdit}
        poolDetail={poolDetail}
      />
    </DefaultLayout>
  )
}

export default withRouter(PoolEdit);
