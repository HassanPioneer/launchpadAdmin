import {ThunkDispatch} from 'redux-thunk';
import {AnyAction} from 'redux';

import {buyTokenActions} from '../constants/buy-token';
import {convertToWei, getContractInstance} from '../../services/web3';
import ErcABI from '../../abi/Erc20.json';
import {alertActions} from '../constants/alert';
import _ from 'lodash';
import {convertAmountToUsdt} from '../../utils/usdt';
import {getBalance} from './balance';
import {MAX_BUY_CAMPAIGN, TRANSACTION_ERROR} from '../../constants';
import { BaseRequest } from '../../request/Request';
import {alertFailure} from "./alert";
import {logout} from "./user";
import campaignABI from "../../abi/Swap/Campaign.json";
import BigNumber from "bignumber.js";
import {getETHPrices} from "../../utils";


const verifyMaxCanBuy = async (
    campaignId: string,
    unit: string,
    amount: any,
    tokenConvert: any,
    getState: () => any,
    dispatch: ThunkDispatch<{}, {}, AnyAction>
  ) => {
  const campaignContract = getContractInstance(campaignABI, campaignId);
  if (campaignContract) {
    const loginUser = getState().investor.data.wallet_address;
    const campaignDetailStore = getState().campaignDetail.data;
    const {tokenAddress, tokenDecimals, erc20ConversionRate, ethRate} = campaignDetailStore;

    let claimableTokensPromise = campaignContract.methods.getClaimableTokens(loginUser).call();
    const campaignDetail = await Promise.all([
      claimableTokensPromise,
    ]);
    const claimableTokens = new BigNumber(campaignDetail[0]).dividedBy(Math.pow(10, tokenDecimals)).toFixed();


    let totalUsdtWillBuy = '0';

    let ethPrice: any = await getETHPrices();
    if (!ethPrice) {
      console.log('Get Price Frontend Fail');
      return true;
    }

    let convertRate = ethRate;
    let ethBought = new BigNumber(claimableTokens).dividedBy(convertRate);
    let totalEthAmount = new BigNumber(ethBought).plus(amount);
    totalUsdtWillBuy = new BigNumber(totalEthAmount).multipliedBy(ethPrice).toFixed();
    console.log('totalUsdtWillBuy', totalUsdtWillBuy);
    const remainUsdtBought = new BigNumber(MAX_BUY_CAMPAIGN).minus(totalUsdtWillBuy).toFixed();


    if (unit == 'eth') {


      const remainEthBought = new BigNumber(remainUsdtBought).dividedBy(ethPrice).toFixed(5);
      const message = 'You\'ve reached the maximum amount of tokens. You can only buy up to: ' + remainEthBought + ' ETH';

      const isOverBought = (new BigNumber(totalUsdtWillBuy).abs()).gt(MAX_BUY_CAMPAIGN);

      console.log('isOverBought', isOverBought);

      if (isOverBought) {
        dispatch(alertFailure(message));
        return false;
      } else {
        console.log(message);
        return true;
      }

    } else {

      const oldEthUsdtBought = new BigNumber(ethBought).multipliedBy(ethPrice).toFixed();
      const usdtBuySuccessed = new BigNumber(claimableTokens).dividedBy(erc20ConversionRate).toFixed();
      totalUsdtWillBuy = new BigNumber(amount).plus(usdtBuySuccessed).plus(oldEthUsdtBought).toFixed();
      console.log('totalUsdtWillBuy', totalUsdtWillBuy);

      const remainUsdtBought = new BigNumber(MAX_BUY_CAMPAIGN).minus(usdtBuySuccessed).toFixed();
      const message = 'You\'ve reached the maximum amount of tokens. You can only buy up to: ' + remainUsdtBought + ' USDT';
      const isOverBought = (new BigNumber(totalUsdtWillBuy)).gt(MAX_BUY_CAMPAIGN);
      if (isOverBought) {
        dispatch(alertFailure(message));
        return false;
      } else {
        console.log(message);
        return true;
      }
    }
  }

  return false;
};

export const isCampaignPurchasable = () => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    try {
      dispatch({
        type: buyTokenActions.BUY_TOKEN_AVAILABLE_LOADING
      })
      const baseRequest = new BaseRequest();
      const response = await baseRequest.post('/public/jwt/verify', {}, true) as any;
      const resObj = await response.json();

      if (resObj?.status === 200 && resObj?.data) {
        if (resObj?.data?.msgCode === 'TOKEN_IS_VALID') {
          dispatch({
            type: buyTokenActions.BUY_TOKEN_AVAILABLE_SUCCESS,
            payload: true
          })
        } else {
          dispatch({
            type: buyTokenActions.BUY_TOKEN_AVAILABLE_SUCCESS,
            payload: false
          })
        }
      } else {
        if (resObj?.status === 401) {
          // dispatch(alertFailure(resObj.message || 'Sorry, the token expired.'));
          console.log('Sorry, the token expired.');
          dispatch(logout(true));
        } else {
          dispatch({
            type: buyTokenActions.BUY_TOKEN_AVAILABLE_SUCCESS,
            payload: false
          });
        }
      }
    } catch (err: any) {
      dispatch({
        type: buyTokenActions.BUY_TOKEN_AVAILABLE_FAILURE,
        payload: err.message,
      });
    }
  }
}
