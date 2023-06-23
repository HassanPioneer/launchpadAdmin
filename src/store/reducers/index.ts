import { combineReducers } from "redux";
import {
  affiliateCampaignReducer,
  affiliateLinkGenerateReducer,
} from "./affiliate";
import { alertReducer } from "./alert";
import { balanceReducer } from "./balance";
import { buyTokenPurchasableReducer, buyTokenReducer } from "./buy-token";
import {
  campaignAffiliateCreateReducer,
  campaignCreateReducer,
  campaignDetailReducer,
  campaignEditReducer,
  campaignErc20RateSetReducer,
  campaignICORegisterReducer,
  campaignLatestActiveReducer,
  campaignLatestReducer,
  campaignProcessingReducer,
  campaignRefundTokensReducer,
  campaignsReducer,
  campaignStatusToggleReducer,
  tbaCampaignsReducer,
} from "./campaign";
import { claimTokenReducer, stakedTokensClaimReducer } from "./claim-token";
import { referralListReducer, referralTopReducer } from "./referrals";
import { settingDeactivateReducer } from "./setting-deactivate";
import { settingDetailReducer } from "./setting-detail";
import { settingFeeRateReducer } from "./setting-fee-rate";
import { settingOwnerReducer } from "./setting-owner";
import { settingRevenueAddressReducer } from "./setting-revenue-address";
import { createTokenReducer, getTokensReducer } from "./token";
import { transactionCampaignReducer } from "./transaction";
import { usdtAllowanceReducer } from "./usdt-allowance";
import { usdtApproveReducer } from "./usdt-approve";
import { usdtDetailReducer } from "./usdt-detail";
import userReducer, {
  investorReducer,
  investorRegisterReducer,
  userConnectReducer,
  userCurrentNetwork,
  userProfileReducer,
  userProfileUpdateReducer,
  userRegisterReducer,
} from "./user";
import {
  whitelistCreateReducer,
  whitelistReducer,
  whitelistRemoveReducer,
} from "./whitelist";

const rootReducer = combineReducers({
  user: userReducer,
  investor: investorReducer,
  investorRegister: investorRegisterReducer,
  userConnect: userConnectReducer,
  userCurrentNetwork: userCurrentNetwork,
  userRegister: userRegisterReducer,
  userProfile: userProfileReducer,
  userProfileUpdate: userProfileUpdateReducer,
  campaigns: campaignsReducer,
  tbaCampaigns: tbaCampaignsReducer,
  campaignProcessing: campaignProcessingReducer,
  campaignCreate: campaignCreateReducer,
  campaignEdit: campaignEditReducer,
  campaignDetail: campaignDetailReducer,
  campaignICORegister: campaignICORegisterReducer,
  campaignAffiliateCreate: campaignAffiliateCreateReducer,
  campaignErc20RateSet: campaignErc20RateSetReducer,
  campaignLatest: campaignLatestReducer,
  campaignLatestActive: campaignLatestActiveReducer,
  campaignStatusToggle: campaignStatusToggleReducer,
  campaignRefundTokens: campaignRefundTokensReducer,
  referralListAll: referralListReducer,
  referralTop: referralTopReducer,
  transactionCampaign: transactionCampaignReducer,
  affiliateCampaign: affiliateCampaignReducer,
  affiliateLinkGenerate: affiliateLinkGenerateReducer,
  buyToken: buyTokenReducer,
  buyTokenPurchasable: buyTokenPurchasableReducer,
  claimToken: claimTokenReducer,
  stakedToken: stakedTokensClaimReducer,
  usdtAllowance: usdtAllowanceReducer,
  usdtApprove: usdtApproveReducer,
  settingDetail: settingDetailReducer,
  settingFeeRate: settingFeeRateReducer,
  settingRevenueAddress: settingRevenueAddressReducer,
  settingOwner: settingOwnerReducer,
  settingDeactivate: settingDeactivateReducer,
  tokensByUser: getTokensReducer,
  tokenCreateByUser: createTokenReducer,
  balance: balanceReducer,
  usdtDetail: usdtDetailReducer,
  alert: alertReducer,
  whitelist: whitelistReducer,
  whitelistCreate: whitelistCreateReducer,
  whitelistRemoveReducer: whitelistRemoveReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
