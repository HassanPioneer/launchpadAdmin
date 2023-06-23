import React, { useEffect } from 'react';
//@ts-ignore
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { useDispatch, useSelector } from 'react-redux';
import { HashRouter as Router, Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import AppContainer from "./AppContainer";
import ErrorBoundary from './components/Base/ErrorBoundary';
import PrivateRoute from './components/Base/PrivateRoute';
import AdminCreate from "./pages/AdminList/AdminDetail/AdminCreate";
import AdminEdit from "./pages/AdminList/AdminDetail/AdminEdit";
import AdminList from "./pages/AdminList/AdminList";
import ErrorPage from './pages/ErrorPage';
import KycUserCreate from "./pages/KycUserList/KycUserDetail/KycUserCreate";
import KycUserEdit from "./pages/KycUserList/KycUserDetail/KycUserEdit";
import KycUserList from "./pages/KycUserList/KycUserList";
import Login from './pages/Login';
import NotFoundPage from './pages/NotFoundPage';
import PoolCreate from "./pages/PoolCreate/PoolCreate";
import PoolEdit from "./pages/PoolCreate/PoolEdit";
import TBAPoolCreate from "./pages/PoolCreate/TBAPoolCreate";
import TBAPoolEdit from "./pages/PoolCreate/TBAPoolEdit";
import Pools from "./pages/Pools";
import StakingPoolCreate from "./pages/StakingPoolCreate/PoolCreate";
import StakingPoolEdit from "./pages/StakingPoolCreate/PoolEdit";
import StakingPools from "./pages/StakingPools";
import Statistic from "./pages/Statistic";
import TBAPools from "./pages/TBAPools";
import TransactionPending from './pages/TransactionPending';
import UserList from "./pages/UserList";
import UserReferral from './pages/UserReferral';
import { clearAlert } from './store/actions/alert';
import { adminRoute } from "./utils";

/**
 * Main App routes.
 */
const Routes: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
  const dispatch = useDispatch();
  const alert = useSelector((state: any) => state.alert);
  const { history } = props;

  useEffect(() => {
    const { type, message } = alert;
    if (type && message) {
      NotificationManager[type](message);
    }
  }, [alert]);

  useEffect(() => {
    history.listen((location, action) => {
      dispatch(clearAlert());
    });
  }, []);

  return (
    <div>
      <Switch>
        <Route
          exact path="/"
          render={() => <Redirect to={`${adminRoute('/campaigns')}`} />}
        />
        <Route
          exact path={`${adminRoute()}`}
          render={() => <Redirect to={`${adminRoute('/campaigns')}`} />}
        />
        <PrivateRoute path={adminRoute('/campaigns')} exact component={Pools} />
        <PrivateRoute path={adminRoute('/campaigns/add')} exact component={PoolCreate} />
        <PrivateRoute exact path={adminRoute('campaign-detail/:id')} component={PoolEdit} />
        <PrivateRoute exact path={adminRoute('/campaign-detail/pending/:id')} component={TransactionPending} />

        <PrivateRoute path={adminRoute('/tba-campaigns')} exact component={TBAPools} />
        <PrivateRoute path={adminRoute('/tba-campaigns/add')} exact component={TBAPoolCreate} />
        <PrivateRoute exact path={adminRoute('tba-campaign-detail/:id')} component={TBAPoolEdit} />

        <PrivateRoute path={adminRoute('/staking')} exact component={StakingPools} />
        <PrivateRoute path={adminRoute('/staking/add')} exact component={StakingPoolCreate} />
        <PrivateRoute path={adminRoute('/staking/:id')} exact component={StakingPoolEdit} />

        <Route path={adminRoute('/login')} component={Login} />

        <Route path={adminRoute('/users')} component={UserList} />

        <Route path={adminRoute('/kyc-users')} component={KycUserList} />
        <Route path={adminRoute('/kyc-user-detail/:id')} component={KycUserEdit} />
        <Route path={adminRoute('/kyc-user-create')} component={KycUserCreate} />

        {/* <PrivateRoute path={adminRoute('/referrals')} component={UserReferral} /> */}

        <Route path={adminRoute('/admins')} component={AdminList} />
        <Route path={adminRoute('/admin-detail/:id')} component={AdminEdit} />
        <Route path={adminRoute('/admin-create')} component={AdminCreate} />

        <Route path={adminRoute('/statistic')} component={Statistic} />

        <PrivateRoute exact path={adminRoute('/error')} component={ErrorPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  )
};

const RoutesHistory = withRouter(Routes);

const routing = function createRouting() {
  return (
    <>
      <NotificationContainer />
      <Router>
        <AppContainer>
          <ErrorBoundary>
            <RoutesHistory />
          </ErrorBoundary>
        </AppContainer>
      </Router>
    </>
  );
};
/**
 * Wrap the app routes into router
 *
 * PROPS
 * =============================================================================
 * @returns {React.Node}
 */
export default routing;
