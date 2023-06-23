import React from 'react';
import DefaultLayout from '../../../components/Layout/DefaultLayout';
import AdminDetailPage from './Detail/AdminDetailPage';
import {Grid} from '@material-ui/core';

import {withRouter} from 'react-router-dom';
import ButtonLink from '../../../components/Base/ButtonLink';
import {useCommonStyle} from '../../../styles';
import {adminRoute} from "../../../utils";

const AdminCreate = (props: any) => {
  const commonStyle = useCommonStyle();

  return (
    <DefaultLayout>
      <div className={commonStyle.headPage}>
        <div className={commonStyle.headPageLeft}>
          <ButtonLink to={adminRoute('/admins')} text="Back" icon="icon-arrow-left.svg">
            <img className="icon-back" src="/images/icon-arrow-left.svg" alt=""/>Back
          </ButtonLink>
        </div>
      </div>
      <div className="contentPage">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <AdminDetailPage
              admin={null}
              loading={false}
              failure={false}
              isCreate={true}
            />
          </Grid>
        </Grid>
      </div>
    </DefaultLayout>
  );
};

export default withRouter(AdminCreate);
