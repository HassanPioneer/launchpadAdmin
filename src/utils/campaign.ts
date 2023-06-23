import _ from "lodash";
import moment from "moment";
import BigNumber from 'bignumber.js';
import {
  NETWORK_AVAILABLE,
  USDC_ADDRESS,
  USDC_BSC_ADDRESS, USDC_POLYGON_ADDRESS,
  USDT_ADDRESS,
  USDT_ARBITRUM_ADDRESS,
  USDT_BSC_ADDRESS,
  USDT_POLYGON_ADDRESS
} from "../constants";


export const checkIsFinishTime = (campaignDetail: any): boolean => {

  const closeTime = _.get(campaignDetail, 'closeTime', '');
  let isFinish = false;
  if (closeTime) {
    const closeTimeDate = moment.unix(parseInt(closeTime)).toDate();
    const currentDate = new Date();
    if (currentDate >= closeTimeDate) {
      isFinish = true;
    }
  }

  return isFinish;
};

export const getTokenRemainingCanBuy = (campaignDetail: any): string => {
  if (!campaignDetail) return '0';
  const tokenLeft = _.get(campaignDetail, 'tokenLeft', 0);
  const tokenClaimed = _.get(campaignDetail, 'tokenClaimed', 0);
  let remainTokenAvailable = new BigNumber(tokenLeft).plus(tokenClaimed);

  return remainTokenAvailable.toFixed();
};

export const checkIsBetweenCloseTimeAndReleaseTime = (campaignDetail: any): boolean => {
  const closeTime = _.get(campaignDetail, 'closeTime', '');
  const releaseTime = _.get(campaignDetail, 'releaseTime', '');

  let isBetween = false;
  if (closeTime && releaseTime) {
    const closeTimeDate = moment.unix(parseInt(closeTime)).toDate();
    const releaseTimeDate = moment.unix(parseInt(releaseTime)).toDate();
    const currentDate = new Date();
    if (closeTimeDate <= currentDate && currentDate < releaseTimeDate) {
      isBetween = true;
    }
  }

  return isBetween;
};

export const campaignClaimConfigFormat = (campaignClaimConfigJSON: string) => {
  let campaignClaimConfigString = campaignClaimConfigJSON || '[]';
  let campaignClaimConfig = JSON.parse(campaignClaimConfigString);
  campaignClaimConfig = campaignClaimConfig.map((item: any, index: number) => {
    item.startTime = item.startTime ? (moment(item.startTime).unix() || null) : null;
    item.endTime = item.endTime ? (moment(item.endTime).unix() || null) : null;
    return item;
  });

  return campaignClaimConfig;
};

export const buyTokenWithSignature = async (data: any) => {
  let {
    poolAddress,
    acceptCurrency,
    amount,
    signature,
    minBuy,
    maxBuy,
    isClaimable,
    networkAvailable,
    poolContract,
    userWalletAddress,
    rate,
  } = data;

  amount = new BigNumber(amount).toFixed(6);

  // const abiUse = isClaimable ? PreSalePool: Pool_ABI;
  // const poolContract = getContract(poolAddress, abiUse, library, connectedAccount as string);

  acceptCurrency = (acceptCurrency + '').toUpperCase();
  let decimals = 6;
  let buyCurr = 'ETH';
  const isBSC = networkAvailable == 'bsc';
  if (networkAvailable == NETWORK_AVAILABLE.BSC) {
    if (acceptCurrency == 'ETH') {
      decimals = 18;
    } else if (acceptCurrency == 'USDT') {
      decimals = 18;
      buyCurr = USDT_BSC_ADDRESS || ''
    } else if (acceptCurrency == 'USDC') {
      decimals = 18;
      buyCurr = USDC_BSC_ADDRESS || ''
    }
  } else if (networkAvailable == NETWORK_AVAILABLE.ETH) {
    if (acceptCurrency == 'ETH') {
      decimals = 18;
    } else if (acceptCurrency == 'USDT') {
      decimals = 6;
      buyCurr = USDT_ADDRESS || ''
    } else if (acceptCurrency == 'USDC') {
      decimals = 6;
      buyCurr = USDC_ADDRESS || ''
    }
  } else if (networkAvailable == NETWORK_AVAILABLE.POLYGON) {
    if (acceptCurrency == 'ETH') {
      decimals = 18;
    } else if (acceptCurrency == 'USDT') {
      decimals = 6;
      buyCurr = USDT_POLYGON_ADDRESS || ''
    } else if (acceptCurrency == 'USDC') {
      decimals = 6;
      buyCurr = USDC_POLYGON_ADDRESS || ''
    }
  } else if (networkAvailable == NETWORK_AVAILABLE.ARBITRUM) {
    if (acceptCurrency == 'ETH') {
      decimals = 18;
    } else if (acceptCurrency == 'USDT') {
      decimals = 6;
      buyCurr = USDT_ARBITRUM_ADDRESS || ''
    } 
  }

  // Calculate token
  amount = new BigNumber(amount).multipliedBy(rate).toFixed(6);

  // For test
  // amount = new BigNumber(amount).div(50);

  const connectedAccount = userWalletAddress;
  const isUseEth = acceptCurrency === 'ETH';
  let params = [];

  // const method = acceptCurrency === 'ETH' ? 'buyTokenByEtherWithPermission': 'buyTokenByTokenWithPermission';
  if (isUseEth) {
    params = [
      connectedAccount,
      connectedAccount,
      maxBuy,
      minBuy,
      signature,
    ];

    const transaction = await poolContract.methods.buyTokenByEtherWithPermission(...params).send({
      from: connectedAccount,
      value: new BigNumber(amount).multipliedBy(10 ** 18).toFixed()
    });
    return transaction;
  } else {
    params = [
      connectedAccount,
      buyCurr,
      new BigNumber(amount).multipliedBy(10 ** decimals).toFixed(),
      connectedAccount,
      maxBuy,
      minBuy,
      signature
    ];

    const transaction = await poolContract.methods.buyTokenByTokenWithPermission(...params).send({
      from: connectedAccount,
    });
    return transaction;
  }

};
