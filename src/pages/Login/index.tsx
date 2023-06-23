import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TextField, CircularProgress } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import { withRouter } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { alertFailure } from '../../store/actions/alert';
import { login, connectWallet, resetUserState } from '../../store/actions/user';
import useStyles from './style';
import Button from '../../components/Base/Button';
import {adminRoute} from "../../utils";
const loginLogo = '/images/login-logo.png';

const Login: React.FC<any> = (props: any) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState('walletConnect');
  const { data: ethAddress = '', loading = false } = useSelector((state: any) => state.userConnect);
  const { loading: userRegisterLoading = false, error: errorRegister } = useSelector((state: any) => state.userRegister);
  const { data: loginUser, loading: userLoginLoading, error } = useSelector((state: any) => state.user);

  const { watch, handleSubmit } = useForm({
    mode: 'onChange'
  });

  const password = useRef({});
  password.current = watch("password", "");

  useEffect(() => {
    if (error || errorRegister) {
      dispatch(alertFailure(error || errorRegister));
    }
  }, [error, errorRegister]);

  useEffect(() => {
    if (ethAddress) {
      setCurrentPage('signIn');
    } else {
      setCurrentPage('walletConnect');
    }
  }, [ethAddress]);

  useEffect(() => {
    if (loginUser) {
      props.history.push(adminRoute('/'));
    }
    return () => {
      error && dispatch(resetUserState());
    }
  }, [loginUser, error]);

  const handleFormSubmit = (data: any) =>  {
    const { passwordLogin } = data;
    dispatch(login(passwordLogin));
  }

  const render = () => {
    if (currentPage === 'walletConnect') {
      return (
        <>
          <div className="login__logo-ether-title">
            Connect Your Wallet
          </div>
          <div className="login__logo-ether">
            <img src="/images/ethereum.jpg" alt="" className="logo-ether" />
            <div className="login__logo-ether-desc">
              <p className="logo__desc--bold">
                Web3 Wallet Detected
              </p>
              <p>
                Connect to continue signing in!
              </p>
            </div>
          </div>
          <Button
            onClick={handleUserLogin}
            label="Connect Wallet"
            loading={loading}
            disabled={loading}
            buttonType="metamask"
            className={`login__button ${currentPage === 'walletConnect' && 'login__button--bold'}` }
          />
        </>
      )
    } else {
      return (
        <>
          <div className="login__logo-ether-title">
            Wallet Connected
          </div>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="login__form">
            <TextField id="standard-secondary" value={ethAddress} label="Current Ethereum Address" color="secondary" className="login__form-field" disabled />

            <button disabled={userRegisterLoading || userLoginLoading} type="submit" className="login__form-button">
              Sign in
              {
                (userRegisterLoading || userLoginLoading) && <CircularProgress size={20} style={{ marginLeft: 10 }} />
              }
            </button>
          </form>
        </>
      )
    }
  }

  const handleUserLogin = () => {
    dispatch(connectWallet());
  };

  return (
    <Container fixed>
      <div className={classes.login}>
        <span className="login__logo">
          <img src={loginLogo} alt="login-logo" />
          <h2 className="login__title">Launchpad</h2>
        </span>
        <div className="login__wrap">
          {
            render()
          }
        </div>
      </div>
    </Container>
  )
};

export default withRouter(Login);
