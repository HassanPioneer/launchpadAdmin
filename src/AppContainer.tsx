import React, {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { userActions } from './store/constants/user';
import { logout } from './store/actions/user';
import { useTypedSelector } from './hooks/useTypedSelector';
import { getWeb3Instance, isMetaMaskInstalled } from './services/web3';
import { withRouter } from 'react-router-dom';
import InstallMetameask from './components/Base/InstallMetamask';
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: 50 });

const NETWORK_ID_BSC = process.env.REACT_APP_REACT_APP_BSC_NETWORK_ID as string;
const NETWORK_ID = process.env.REACT_APP_ETH_NETWORK_ID as string;

const AppContainer = (props: any) => {
  const dispatch = useDispatch();
  const { data: loginUser } = useTypedSelector(state => state.user);
  const { data: loginInvestor } = useTypedSelector(state => state.investor);

  const web3Instance = getWeb3Instance();

  const onLoginWithoutLoginPage = async () => {
    if (isMetaMaskInstalled()) {
      const { history } = props;
      const { ethereum } = window as any;

      ethereum.request({
        method: 'net_version'
      }).then((currentNetworkId: string) => {
        localStorage.setItem('NETWORK_ID', currentNetworkId);
        dispatch({ type: userActions.USER_WALLET_CHANGED, payload: currentNetworkId });
      });

      web3Instance?.eth.getAccounts().then((accounts: any) => {
        // console.log('NO_ACCOUNT');
        if (accounts.length === 0) {
          dispatch({ type: userActions.USER_CONNECT_WALLET_LOCK });
          dispatch({ type: userActions.USER_WALLET_CHANGED, payload: '' });

          const pathName = history.location.pathname;
          console.log('dispatch(logout());', pathName);
        }
      });


    }
  };

  useEffect(()  => {
    onLoginWithoutLoginPage();
  }, [props.location.pathname]);

  useEffect(() => {
    const windowObj = window as any;
    const { ethereum } = windowObj;

    if (ethereum) {
      web3Instance?.eth?.getAccounts().then((accounts: any) => {
          accounts[0] && dispatch({
            type: userActions.USER_CONNECT_WALLET_SUCCESS,
            payload: accounts[0]
          });
      });

      ethereum.on('accountsChanged', function (accounts: any) {
        console.log('accountsChanged');
        const account = accounts.length ? accounts[0] : '';

        if (account) {
          if (loginUser && account !== loginUser.wallet_address) {
            dispatch(logout());
          }
          if (loginInvestor && account !== loginInvestor.wallet_address) {
            dispatch(logout(true));
          } else {
            dispatch({
              type: userActions.USER_CONNECT_WALLET_SUCCESS,
              payload: account,
            });
          }
        } else {
          dispatch(logout());
          dispatch({
            type: userActions.USER_CONNECT_WALLET_LOCK,
          });
        }
      });

      ethereum.on('chainChanged', (newNetworkId: string) => {
        console.log('chainChanged');
        localStorage.setItem('NETWORK_ID', String(Number(newNetworkId)));
        dispatch({ type: userActions.USER_WALLET_CHANGED, payload: String(Number(newNetworkId)) });
        if (
          Number(NETWORK_ID) !== Number(newNetworkId) &&
          Number(NETWORK_ID_BSC) !== Number(newNetworkId)
        ) {
          console.log('Network change: NETWORK_ID:', newNetworkId);
          // dispatch(alertFailure('Please change to correct Network !'));
        }

        // const { history } = props;
        // const pathName = history.location.pathname;
        // let backUrlKey = checkIsAdminRoute(pathName) ? BACK_URL_NETWORK_CHANGE_OWNER : BACK_URL_NETWORK_CHANGE;
        //
        // console.log('pathName', pathName);
        // console.log('backUrlKey', backUrlKey);
        //
        //
        // const backUrl = localStorage.getItem(backUrlKey);
        // console.log('SAME_NETWORK');
        // console.log('backUrl', backUrl);
        //
        // if (backUrl) {
        //   if (backUrlKey === BACK_URL_NETWORK_CHANGE_OWNER) {
        //     history.push('/dashboard');
        //   } else {
        //     history.push(backUrl);
        //   }
        //   setTimeout(() => {
        //     localStorage.removeItem(backUrlKey);
        //   }, 1000);
        // }

      });
    }
  }, [loginUser]);

  if (!isMetaMaskInstalled()) {
    return (
      <InstallMetameask />
    );
  }

  return (
    <>
      {props.children}
    </>
  );
};

export default withRouter(AppContainer);
