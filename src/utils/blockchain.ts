import {getContractInstance, getWeb3Instance} from "../services/web3";
import campaignABI from "../abi/Swap/Campaign.json";

const USDT_LINK_DEFAULT_ADDRESS = process.env.REACT_APP_SMART_CONTRACT_ETH_USDT_ADDRESS || "";

export const getPoolBlockchainInfo = async (loginUser: any, params: any): Promise<any> => {

  const campaignHash = params.campaign_hash;
  const web3Instance = getWeb3Instance();
  const campaignContract = getContractInstance(campaignABI, campaignHash);

  if (web3Instance && campaignContract) {
    // Get All information of selected campaign
    const title = campaignContract.methods.name().call();
    const fundingWallet = campaignContract.methods.fundingWallet().call();
    const tokenSold = campaignContract.methods.tokenSold().call();
    const weiRaised = campaignContract.methods.weiRaised().call();
    const startTime = campaignContract.methods.openTime().call();
    const closeTime = campaignContract.methods.closeTime().call();
    const token = campaignContract.methods.token().call();
    const owner = campaignContract.methods.owner().call();
    const isSuspend = campaignContract.methods.paused().call();
    const etherRate =  campaignContract.methods.getEtherConversionRate().call();
    const etherConversionRateDecimals = campaignContract.methods.getEtherConversionRateDecimals().call();
    const ethLink = "0x00";
    const erc20ConversionRate = campaignContract.methods.getErc20TokenConversionRate(USDT_LINK_DEFAULT_ADDRESS).call();

    // const releaseTime = campaignContract.methods.releaseTime().call();
    // const isClaimable = campaignContract.methods.isClaimable().call();
    // const claimableTokens = campaignContract.methods.getClaimableTokens(userWalletAddress).call();
    // const tokenClaimed = campaignContract.methods.tokenClaimed().call();

    const campaignDetail = await Promise.all([
      title, tokenSold, weiRaised,
      ethLink, etherRate, startTime,
      closeTime, fundingWallet, token,
      owner, erc20ConversionRate, isSuspend,
      etherConversionRateDecimals,
      // isClaimable, claimableTokens,
      // releaseTime, tokenClaimed,
    ]);

    const campaignInfo = {
      title: campaignDetail[0],
      tokenSold: campaignDetail[1],
      weiRaised: campaignDetail[2],
      ethLink: campaignDetail[3],
      etherRate: campaignDetail[4],
      startTime: campaignDetail[5],
      closeTime: campaignDetail[6],
      fundingWallet: campaignDetail[7],
      token: campaignDetail[8],
      owner: campaignDetail[9],
      erc20ConversionRate: campaignDetail[10],
      isSuspend: campaignDetail[11],
      etherConversionRateDecimals: campaignDetail[12],
    };


    return campaignInfo;
  }
};
