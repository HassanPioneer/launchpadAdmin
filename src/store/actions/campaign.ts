import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import BigNumber from 'bignumber.js';
//@ts-ignore
import removeTrailingZeros from 'remove-trailing-zeros';

import { campaignActions } from '../constants/campaign';
import { alertActions } from '../constants/alert';
import { BaseRequest } from '../../request/Request';
import campaignFactoryABI from '../../abi/Claim/CampaignFactory.json';

import { getContractInstance } from '../../services/web3';
import {updateDeploySuccess} from "../../request/pool";
import {ACCEPT_CURRENCY, NETWORK_AVAILABLE, MAPPING_CURRENCY_ADDRESS, NATIVE_TOKEN_ADDRESS} from "../../constants";
const queryString = require('query-string');

export const getCampaigns = (currentPage: number = 1, query: string = '', startTime: string, finishTime: string, filter: boolean = false) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
    const baseRequest = new BaseRequest();
    const loginUser = getState().user.data.wallet_address;

    dispatch({ type: campaignActions.CAMPAIGNS_REQUEST });

    let url = `/campaigns`; //page=${currentPage}&title=${query}&start_time=${startTime}&finish_time=${finishTime}
    const queryParams = {
      page: currentPage,
      title: query,
      start_time: startTime,
      finish_time: finishTime,
      registed_by: null,
    };
    if (filter) {
      queryParams.registed_by = loginUser;
    }
    url += '?' + queryString.stringify(queryParams);

    try {
      const response = await baseRequest.get(url) as any;
      const resObject = await response.json();

      if (resObject.status === 200) {
        const { total, page, lastPage, data } = resObject.data;

        dispatch({
          type: campaignActions.CAMPAIGNS_SUCCESS,
          payload: {
            total,
            page,
            lastPage,
            data
          }
        })
      }
    } catch (err: any) {
      dispatch({
        type: campaignActions.CAMPAIGNS_FAIL,
        payload: err.message
      })
    }

  }
}

export const getTBACampaigns = (currentPage: number = 1) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
    const baseRequest = new BaseRequest();

    dispatch({ type: campaignActions.TBA_CAMPAIGNS_REQUEST });

    let url = `/admin/tba-pools`; // /admin/tba-pools?limit=5&page=1
    const queryParams = {
      limit: 10,
      page: currentPage,
    };
    url += '?' + queryString.stringify(queryParams);

    try {
      const response = await baseRequest.get(url) as any;
      const resObject = await response.json();

      if (resObject.status === 200) {
        const { total, page, lastPage, data } = resObject.data;

        dispatch({
          type: campaignActions.TBA_CAMPAIGNS_SUCCESS,
          payload: {
            total,
            page,
            lastPage,
            data
          }
        })
      } else {
        dispatch({
          type: campaignActions.TBA_CAMPAIGNS_FAIL,
          payload: null
        })
      }
    } catch (err: any) {
      console.log(err)
      dispatch({
        type: campaignActions.TBA_CAMPAIGNS_FAIL,
        payload: err.message
      })
    }

  }
}


export const getCampaignDetailHttp = (transactionHash: string) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    const baseRequest = new BaseRequest();

    dispatch({ type: campaignActions.CAMPAIGN_DETAIL_HTTP_REQUEST });

    let url = `/campaigns/${transactionHash}`;

    try {
      const response = await baseRequest.get(url) as any;
      const resObject = await response.json();

      if (resObject.status === 200) {
        const { is_pause: isProcessing } = resObject.data;

        dispatch({
          type: campaignActions.CAMPAIGN_DETAIL_HTTP_SUCCESS,
          payload: {
            isProcessing,
            ...resObject.data
          }
        })
      }
    } catch (err) {
      dispatch({
        type: campaignActions.CAMPAIGN_DETAIL_HTTP_FAIL,
        payload: false
      })
    }
  }
}

export const deployPool = (campaign: any, history: any) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
    try {
      dispatch({ type: campaignActions.MY_CAMPAIGN_CREATE_REQUEST });

      const {
        start_time, finish_time, start_pre_order_time,
        token, address_receiver, token_by_eth, tokenInfo,
        accept_currency, network_available
      } = campaign;
      const startTimeUnix = start_pre_order_time || start_time;
      const finishTimeUnix = finish_time;
      const durationTime = finishTimeUnix - startTimeUnix;

      // native token
      let paidTokenAddress = MAPPING_CURRENCY_ADDRESS[network_available]?.[accept_currency]
      if (!paidTokenAddress) {
        paidTokenAddress = NATIVE_TOKEN_ADDRESS
      }

      let tokenByETHActualRate: any;
      let reversedRate = removeTrailingZeros(new BigNumber(1).dividedBy(token_by_eth).toFixed());
      // Maximum padding 30 (minus 6-18, based on accept_currency decimals)
      const digitsAfterDecimals = 30;

      if (network_available == NETWORK_AVAILABLE.ETH) {
        if (accept_currency === ACCEPT_CURRENCY.ETH) {
          tokenByETHActualRate = new BigNumber(reversedRate).multipliedBy(Math.pow(10, tokenInfo.decimals - 18 + digitsAfterDecimals)).toFixed(0);
        } else if (accept_currency === ACCEPT_CURRENCY.USDT) {
          tokenByETHActualRate = new BigNumber(reversedRate).multipliedBy(Math.pow(10, tokenInfo.decimals - 6 + digitsAfterDecimals)).toFixed(0);
        } else if (accept_currency === ACCEPT_CURRENCY.USDC) {
          tokenByETHActualRate = new BigNumber(reversedRate).multipliedBy(Math.pow(10, tokenInfo.decimals - 6 + digitsAfterDecimals)).toFixed(0);
        }
      } else if (network_available == NETWORK_AVAILABLE.BSC) {
        if (accept_currency === ACCEPT_CURRENCY.ETH) {
          tokenByETHActualRate = new BigNumber(reversedRate).multipliedBy(Math.pow(10, tokenInfo.decimals - 18 + digitsAfterDecimals)).toFixed(0);
        } else if (accept_currency === ACCEPT_CURRENCY.BUSD) {
          tokenByETHActualRate = new BigNumber(reversedRate).multipliedBy(Math.pow(10, tokenInfo.decimals - 18 + digitsAfterDecimals)).toFixed(0);
        } else if (accept_currency === ACCEPT_CURRENCY.USDT) {
          tokenByETHActualRate = new BigNumber(reversedRate).multipliedBy(Math.pow(10, tokenInfo.decimals - 18 + digitsAfterDecimals)).toFixed(0);
        } else if (accept_currency === ACCEPT_CURRENCY.USDC) {
          tokenByETHActualRate = new BigNumber(reversedRate).multipliedBy(Math.pow(10, tokenInfo.decimals - 18 + digitsAfterDecimals)).toFixed(0);
        }
      } else if (network_available == NETWORK_AVAILABLE.POLYGON) {
        if (accept_currency === ACCEPT_CURRENCY.ETH) {
          tokenByETHActualRate = new BigNumber(reversedRate).multipliedBy(Math.pow(10, tokenInfo.decimals - 18 + digitsAfterDecimals)).toFixed(0);
        } else if (accept_currency === ACCEPT_CURRENCY.USDT) {
          tokenByETHActualRate = new BigNumber(reversedRate).multipliedBy(Math.pow(10, tokenInfo.decimals - 6 + digitsAfterDecimals)).toFixed(0);
        } else if (accept_currency === ACCEPT_CURRENCY.USDC) {
          tokenByETHActualRate = new BigNumber(reversedRate).multipliedBy(Math.pow(10, tokenInfo.decimals - 6 + digitsAfterDecimals)).toFixed(0);
        }
      } else if (network_available == NETWORK_AVAILABLE.AVALANCHE) {
        if (accept_currency === ACCEPT_CURRENCY.ETH) {
          tokenByETHActualRate = new BigNumber(reversedRate).multipliedBy(Math.pow(10, tokenInfo.decimals - 18 + digitsAfterDecimals)).toFixed(0);
        } else if (accept_currency === ACCEPT_CURRENCY.USDT) {
          tokenByETHActualRate = new BigNumber(reversedRate).multipliedBy(Math.pow(10, tokenInfo.decimals - 6 + digitsAfterDecimals)).toFixed(0);
        }
      } else if (network_available == NETWORK_AVAILABLE.ARBITRUM) {
        if (accept_currency === ACCEPT_CURRENCY.ETH) {
          tokenByETHActualRate = new BigNumber(reversedRate).multipliedBy(Math.pow(10, tokenInfo.decimals - 18 + digitsAfterDecimals)).toFixed(0);
        } else if (accept_currency === ACCEPT_CURRENCY.USDT) {
          tokenByETHActualRate = new BigNumber(reversedRate).multipliedBy(Math.pow(10, tokenInfo.decimals - 6 + digitsAfterDecimals)).toFixed(0);
        }
      }
      console.log('tokenByETHActualRate', tokenByETHActualRate, digitsAfterDecimals);

      // const poolType = campaign.pool_type;
      let factorySmartContract = getContractInstance(campaignFactoryABI, process.env.REACT_APP_SMART_CONTRACT_ETH_PRESALE_FACTORY_ADDRESS || '');

      switch (network_available) {
        case NETWORK_AVAILABLE.BSC:
          const poolBscAddress = process.env.REACT_APP_SMART_CONTRACT_BSC_PRESALE_FACTORY_ADDRESS;
          factorySmartContract = getContractInstance(campaignFactoryABI, poolBscAddress || '', false);
          break
        case NETWORK_AVAILABLE.POLYGON:
          const poolPolygonAddress = process.env.REACT_APP_SMART_CONTRACT_POLYGON_PRESALE_FACTORY_ADDRESS;
          factorySmartContract = getContractInstance(campaignFactoryABI, poolPolygonAddress || '', false);
          break
        case NETWORK_AVAILABLE.AVALANCHE:
          const poolAvalancheAddress = process.env.REACT_APP_SMART_CONTRACT_AVALANCHE_PRESALE_FACTORY_ADDRESS;
          factorySmartContract = getContractInstance(campaignFactoryABI, poolAvalancheAddress || '', false);
          break
        case NETWORK_AVAILABLE.ARBITRUM:
          const poolArbitrumAddress = process.env.REACT_APP_SMART_CONTRACT_ARBITRUM_PRESALE_FACTORY_ADDRESS;
          factorySmartContract = getContractInstance(campaignFactoryABI, poolArbitrumAddress || '', false);
          break
        default:
          // default is init value above
      }

      if (factorySmartContract) {
        let createdCampaign;
        const userWalletAddress = getState().user.data.wallet_address;
        const signerWallet = campaign.wallet.wallet_address;
        console.log('userWallet', signerWallet);

        createdCampaign = await factorySmartContract.methods.registerPool(
          token,
          durationTime,
          startTimeUnix,

          paidTokenAddress,
          digitsAfterDecimals,
          tokenByETHActualRate,
          address_receiver,
          signerWallet,
        ).send({
          from: userWalletAddress,
        });

        console.log('Deploy Response: ', createdCampaign);
        if (createdCampaign) {
          dispatch({ type: alertActions.SUCCESS_MESSAGE, payload: 'Deploy Pool Successful!'});

          let campaignHash = '';
          if (createdCampaign?.events && createdCampaign?.events && createdCampaign?.events[0]) {
            campaignHash = createdCampaign?.events[0].address;
          }
          const updateData = {
            campaign_hash: campaignHash,
            token_symbol: tokenInfo.symbol,
            token_name: tokenInfo.name,
            token_decimals: tokenInfo.decimals,
            token_address: tokenInfo.address,
          };

          await updateDeploySuccess(updateData, campaign.id);
        }
      }
    } catch (err: any) {
      console.log('ERROR: ', err);

      dispatch({
        type: campaignActions.MY_CAMPAIGN_CREATE_FAIL,
        payload: err.message
      });

      dispatch({
        type: alertActions.ERROR_MESSAGE,
        payload: err.message
      });
    }
  }
}

export const deployClaimPool = (campaign: any, history: any) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
    try {
      dispatch({ type: campaignActions.MY_CAMPAIGN_CREATE_REQUEST });

      const {
        start_time, finish_time, start_pre_order_time,
        token, address_receiver, token_by_eth, tokenInfo, wallet,
        accept_currency, network_claim
      } = campaign;
      const startTimeUnix = start_pre_order_time || start_time;
      const finishTimeUnix = finish_time;
      const durationTime = finishTimeUnix - startTimeUnix;

      // native token
      let paidTokenAddress = MAPPING_CURRENCY_ADDRESS[network_claim]?.[accept_currency]
      if (!paidTokenAddress) {
        paidTokenAddress = NATIVE_TOKEN_ADDRESS
      }

      let tokenByETHActualRate: any;
      let reversedRate = removeTrailingZeros(new BigNumber(1).dividedBy(token_by_eth).toFixed());
      // Maximum padding 30 (minus 6-18, based on accept_currency decimals)
      const digitsAfterDecimals = 30;

      if (network_claim == NETWORK_AVAILABLE.ETH) {
        if (accept_currency === ACCEPT_CURRENCY.ETH) {
          tokenByETHActualRate = new BigNumber(reversedRate).multipliedBy(Math.pow(10, tokenInfo.decimals - 18 + digitsAfterDecimals)).toFixed(0);
        } else if (accept_currency === ACCEPT_CURRENCY.USDT) {
          tokenByETHActualRate = new BigNumber(reversedRate).multipliedBy(Math.pow(10, tokenInfo.decimals - 6 + digitsAfterDecimals)).toFixed(0);
        } else if (accept_currency === ACCEPT_CURRENCY.USDC) {
          tokenByETHActualRate = new BigNumber(reversedRate).multipliedBy(Math.pow(10, tokenInfo.decimals - 6 + digitsAfterDecimals)).toFixed(0);
        }
      } else if (network_claim == NETWORK_AVAILABLE.BSC) {
        if (accept_currency === ACCEPT_CURRENCY.ETH) {
          tokenByETHActualRate = new BigNumber(reversedRate).multipliedBy(Math.pow(10, tokenInfo.decimals - 18 + digitsAfterDecimals)).toFixed(0);
        } else if (accept_currency === ACCEPT_CURRENCY.BUSD) {
          tokenByETHActualRate = new BigNumber(reversedRate).multipliedBy(Math.pow(10, tokenInfo.decimals - 18 + digitsAfterDecimals)).toFixed(0);
        } else if (accept_currency === ACCEPT_CURRENCY.USDT) {
          tokenByETHActualRate = new BigNumber(reversedRate).multipliedBy(Math.pow(10, tokenInfo.decimals - 18 + digitsAfterDecimals)).toFixed(0);
        } else if (accept_currency === ACCEPT_CURRENCY.USDC) {
          tokenByETHActualRate = new BigNumber(reversedRate).multipliedBy(Math.pow(10, tokenInfo.decimals - 18 + digitsAfterDecimals)).toFixed(0);
        }
      } else if (network_claim == NETWORK_AVAILABLE.POLYGON) {
        if (accept_currency === ACCEPT_CURRENCY.ETH) {
          tokenByETHActualRate = new BigNumber(reversedRate).multipliedBy(Math.pow(10, tokenInfo.decimals - 18 + digitsAfterDecimals)).toFixed(0);
        } else if (accept_currency === ACCEPT_CURRENCY.USDT) {
          tokenByETHActualRate = new BigNumber(reversedRate).multipliedBy(Math.pow(10, tokenInfo.decimals - 6 + digitsAfterDecimals)).toFixed(0);
        } else if (accept_currency === ACCEPT_CURRENCY.USDC) {
          tokenByETHActualRate = new BigNumber(reversedRate).multipliedBy(Math.pow(10, tokenInfo.decimals - 6 + digitsAfterDecimals)).toFixed(0);
        }
      } else if (network_claim == NETWORK_AVAILABLE.AVALANCHE) {
        if (accept_currency === ACCEPT_CURRENCY.ETH) {
          tokenByETHActualRate = new BigNumber(reversedRate).multipliedBy(Math.pow(10, tokenInfo.decimals - 18 + digitsAfterDecimals)).toFixed(0);
        } else if (accept_currency === ACCEPT_CURRENCY.USDT) {
          tokenByETHActualRate = new BigNumber(reversedRate).multipliedBy(Math.pow(10, tokenInfo.decimals - 6 + digitsAfterDecimals)).toFixed(0);
        } else if (accept_currency === ACCEPT_CURRENCY.USDC) {
          tokenByETHActualRate = new BigNumber(reversedRate).multipliedBy(Math.pow(10, tokenInfo.decimals - 6 + digitsAfterDecimals)).toFixed(0);
        }
      }

      console.log('tokenByETHActualRate', tokenByETHActualRate, digitsAfterDecimals);

      // const poolType = campaign.pool_type;
      let factorySmartContract = getContractInstance(campaignFactoryABI, process.env.REACT_APP_SMART_CONTRACT_ETH_PRESALE_FACTORY_ADDRESS || '');

      switch (network_claim) {
        case NETWORK_AVAILABLE.BSC:
          const poolBscAddress = process.env.REACT_APP_SMART_CONTRACT_BSC_PRESALE_FACTORY_ADDRESS;
          factorySmartContract = getContractInstance(campaignFactoryABI, poolBscAddress || '', false);
          break
        case NETWORK_AVAILABLE.POLYGON:
          const poolPolygonAddress = process.env.REACT_APP_SMART_CONTRACT_POLYGON_PRESALE_FACTORY_ADDRESS;
          factorySmartContract = getContractInstance(campaignFactoryABI, poolPolygonAddress || '', false);
          break
        case NETWORK_AVAILABLE.AVALANCHE:
          const poolAvalancheAddress = process.env.REACT_APP_SMART_CONTRACT_AVALANCHE_PRESALE_FACTORY_ADDRESS;
          factorySmartContract = getContractInstance(campaignFactoryABI, poolAvalancheAddress || '', false);
          break
        case NETWORK_AVAILABLE.ARBITRUM:
          const poolArbitrumAddress = process.env.REACT_APP_SMART_CONTRACT_ARBITRUM_PRESALE_FACTORY_ADDRESS;
          factorySmartContract = getContractInstance(campaignFactoryABI, poolArbitrumAddress || '', false);
          break
        default:
          // default is init value above
      }

      if (factorySmartContract) {
        let createdCampaign;
        const userWalletAddress = getState().user.data.wallet_address;
        const signerWallet = wallet.wallet_address;

        console.log(token,
          durationTime,
          startTimeUnix,

          paidTokenAddress,
          digitsAfterDecimals,
          tokenByETHActualRate,
          address_receiver,
          signerWallet)
        createdCampaign = await factorySmartContract.methods.registerPool(
          token,
          durationTime,
          startTimeUnix,

          paidTokenAddress,
          digitsAfterDecimals,
          tokenByETHActualRate,
          address_receiver,
          signerWallet,
        ).send({
          from: userWalletAddress,
        });

        console.log('Deploy Response: ', createdCampaign);
        if (createdCampaign) {
          dispatch({ type: alertActions.SUCCESS_MESSAGE, payload: 'Deploy Pool Successful!'});

          let campaignHash = '';
          if (createdCampaign?.events && createdCampaign?.events && createdCampaign?.events[0]) {
            campaignHash = createdCampaign?.events[0].address;
          }
          const updateData = {
            campaign_claim_hash: campaignHash,
            token_symbol: tokenInfo.symbol,
            token_name: tokenInfo.name,
            token_decimals: tokenInfo.decimals,
            token_address: tokenInfo.address,
          };

          await updateDeploySuccess(updateData, campaign.id);
        }
      }
    } catch (err: any) {
      console.log('ERROR: ', err);

      dispatch({
        type: campaignActions.MY_CAMPAIGN_CREATE_FAIL,
        payload: err.message
      });

      dispatch({
        type: alertActions.ERROR_MESSAGE,
        payload: err.message
      });
    }
  }
}
