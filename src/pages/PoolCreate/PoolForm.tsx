import { CircularProgress, Grid } from "@material-ui/core";
import _, { uniqBy } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { TIERS } from "../../constants";
import { createPool, updatePool } from "../../request/pool";
import { alertFailure, alertSuccess } from "../../store/actions/alert";
import { deployPool, deployClaimPool } from "../../store/actions/campaign";
import { adminRoute } from "../../utils";
import { campaignClaimConfigFormat } from "../../utils/campaign";
import { getTokenInfo, TokenTypeProps } from "../../utils/token";
import useStyles from "./style";
import TabProjectInfo from "./TabProjectInfo";
import TabTimeSettings from "./TabTimeSettings";
import TabUserList from "./TabUserList";

const ACTIVE_TABS = {
  PROJECT_INFO: 1,
  TIME_SETTINGS: 2,
  USER_LIST: 3,
};

function PoolForm(props: any) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = props.history;

  const { data: loginUser } = useSelector((state: any) => state.user);

  const { isEdit, poolDetail } = props;
  const [loading, setLoading] = useState(false);
  const [loadingDeploy, setLoadingDeploy] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [token, setToken] = useState<TokenTypeProps | null>(null);
  const [needValidate, setNeedValidate] = useState(false);
  const [activeTab, setActiveTab] = useState<number>(ACTIVE_TABS.PROJECT_INFO);

  const { register, setValue, getValues, clearErrors, errors, handleSubmit, control, watch } =
    useForm({
      mode: "onChange",
      defaultValues: poolDetail,
      reValidateMode: "onChange",
    });

  const tokenAddress = watch("token");
  const tokenRate = watch("tokenRate");

  // Validate duration time
  useEffect(() => {
    if (_.isEmpty(errors)) return;
    let validateDurationTime =
      errors.end_join_pool_time ||
      errors.finish_time ||
      errors.start_join_pool_time ||
      errors.start_time;
    if (validateDurationTime) {
      setActiveTab(ACTIVE_TABS.TIME_SETTINGS);
      window.scrollTo(0, 0);
    }
  }, [errors]);

  const createUpdatePool = async (data: any) => {
    if (!data) return;
    // Format Tiers
    const minTier = data.minTier;
    let tierConfiguration = data.tierConfiguration || "[]";
    tierConfiguration = JSON.parse(tierConfiguration);
    tierConfiguration = tierConfiguration.map((currency: any, index: number) => {
      const item = {
        ...currency,
        currency: data.acceptCurrency,
      };
      if (index < minTier) {
        item.maxBuy = 0;
        item.minBuy = 0;
      }

      item.startTime = item.startTime ? moment(item.startTime).unix() || null : null;
      item.endTime = item.endTime ? moment(item.endTime).unix() || null : null;
      return item;
    });

    tierConfiguration = uniqBy(tierConfiguration, "name");

    // Format Claim Config
    let campaignClaimConfig = data.campaignClaimConfig || "[]";
    campaignClaimConfig = JSON.parse(campaignClaimConfig);
    campaignClaimConfig = campaignClaimConfig.map((item: any, index: number) => {
      item.startTime = item.startTime ? moment(item.startTime).unix() || null : null;
      item.endTime = item.endTime ? moment(item.endTime).unix() || null : null;
      return item;
    });

    let tokenInfo: any = {
      symbol: data?.token_symbol,
    };

    if (data.token) {
      tokenInfo = await getTokenInforDetail(data.token);
      if (!tokenInfo?.symbol) {
        throw Error("Token Information has not been loaded !!!");
      }

      tokenInfo.symbol = data?.token_symbol;
    }

    // Refund time configuration
    const listing_time = data.listing_time ? data.listing_time.unix() : null;

    const submitData = {
      registed_by: loginUser?.wallet_address,
      is_display: data.is_display,

      // Pool general
      title: data.title,
      website: data.website,
      relationship_type: data.relationship_type,
      market_maker: data.market_maker,
      market_maker_icon: data.market_maker_icon,
      banner: data.banner,
      description: data.description,
      address_receiver: data.addressReceiver,

      // Token
      token: data.token,
      token_images: data.tokenImages,
      total_sold_coin: data.totalSoldCoin,
      coingecko_id: data.coingeckoId,

      token_by_eth: data.tokenRate,
      token_conversion_rate: data.tokenRate,

      price_usdt: data.price_usdt,
      display_price_rate: data.display_price_rate,

      // TokenInfo
      tokenInfo,

      // Time
      start_time: data.start_time ? data.start_time.unix() : null,
      finish_time: data.finish_time ? data.finish_time.unix() : null,
      release_time: data.release_time ? data.release_time.unix() : null,
      start_join_pool_time: data.start_join_pool_time ? data.start_join_pool_time.unix() : null,
      end_join_pool_time: data.end_join_pool_time ? data.end_join_pool_time.unix() : null,
      pre_order_min_tier: data.pre_order_min_tier,
      listing_time: listing_time,
      start_refund_time: listing_time,
      end_refund_time: data.end_refund_time?.unix(),
      start_pre_order_time: data.start_pre_order_time ? data.start_pre_order_time.unix() : null,

      // Types
      accept_currency: data.acceptCurrency,
      network_available: data.networkAvailable,
      network_claim: data.networkClaim,
      buy_type: data.buyType,
      pool_type: data.poolType,
      kyc_bypass: data.kyc_bypass,
      airdrop_network: data.airdropNetwork,

      // Private Pool Setting
      is_private: data.isPrivate,

      // Tier
      min_tier: data.minTier,
      tier_configuration: tierConfiguration,

      // Claim Configuration
      claim_configuration: campaignClaimConfig,

      // Wallet
      wallet: isEdit ? poolDetail?.wallet : {},

      // Whitelist Social Requirement
      self_twitter: data.self_twitter,
      self_group: data.self_group,
      self_channel: data.self_channel,
      self_retweet_post: data.self_retweet_post,
      self_retweet_post_hashtag: data.self_retweet_post_hashtag,
      partner_twitter: data.partner_twitter,
      partner_group: data.partner_group,
      partner_channel: data.partner_channel,
      partner_retweet_post: data.partner_retweet_post,
      partner_retweet_post_hashtag: data.partner_retweet_post_hashtag,
      gleam_link: data.gleam_link,
      participant_number: data.participant_number,

      // Forbidden Countries Setting
      forbidden_countries: data.forbidden_countries,

      announcement_time: data.announcement_time ? data.announcement_time.unix() : null,

      // Progress Display Setting
      token_sold_display: data.token_sold_display,
      progress_display: data.progress_display,

      // Lock Schedule Setting
      lock_schedule: data.lock_schedule,

      // Social Media
      medium_link: data.medium_link,
      twitter_link: data.twitter_link,
      telegram_link: data.telegram_link,
      discord_link: data.discord_link,
      youtube_link: data.youtube_link,
      facebook_link: data.facebook_link,

      // Claim Policy
      claim_policy: data.claim_policy,
      claim_type: data.claim_type,
      claim_guide: data.claim_guide,
      remaining_tokens: data.remaining_tokens,
      first_time_claim_phase: data.first_time_claim_phase
        ? data.first_time_claim_phase.unix()
        : null,

      // Free Time Settings
      freeBuyTimeSetting: {
        start_time_free_buy: data.start_time_free_buy ? data.start_time_free_buy.unix() : null,
        max_bonus_free_buy: data.max_bonus_free_buy,
      },
    };

    console.log("[createUpdatePool] - Submit with data: ", submitData);

    let response = {};
    if (isEdit) {
      response = await updatePool(submitData, poolDetail.id);
    } else {
      response = await createPool(submitData);
    }

    return response;
  };

  const handleFormSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response: any = await createUpdatePool(data);
      if (response?.status === 200) {
        dispatch(alertSuccess("Successful!"));
        if (isEdit) {
          // window.location.reload();
        } else {
          history.push(adminRoute("/campaigns"));
        }
      } else {
        dispatch(alertFailure("Fail!"));
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log("ERROR: ", e);
    }
  };

  // Update After Deploy
  const updatePoolAfterDeloy = async (data: any) => {
    // Format Claim Config
    let campaignClaimConfig = data.campaignClaimConfig || "[]";
    campaignClaimConfig = campaignClaimConfigFormat(campaignClaimConfig);
    console.log("campaignClaimConfig", campaignClaimConfig);

    let tokenInfo: any = {
      symbol: data?.token_symbol,
    };

    if (data.token) {
      tokenInfo = await getTokenInforDetail(data.token);
      if (!tokenInfo?.symbol) {
        throw Error("Token Information has not been loaded !!!");
      }

      tokenInfo.symbol = data?.token_symbol;
    }
    const listing_time = data.listing_time ? data.listing_time.unix() : null;

    const submitData = {
      // Pool general
      title: data.title,
      website: data.website,
      relationship_type: data.relationship_type,
      market_maker: data.market_maker,
      market_maker_icon: data.market_maker_icon,
      banner: data.banner,
      description: data.description,

      // USDT Price
      price_usdt: data.price_usdt, // Do not check isAcceptEth
      display_price_rate: data.display_price_rate,

      tokenInfo,

      // Token
      token_images: data.tokenImages,
      total_sold_coin: data.totalSoldCoin,
      coingecko_id: data.coingeckoId,

      // KYC required
      kyc_bypass: data.kyc_bypass,
      airdrop_network: data.airdrop_network,

      // Claim Configuration
      claim_configuration: campaignClaimConfig,
      // Time
      // Release time will auto fill from first record of Campaign Claim Config Table
      release_time: data.release_time ? data.release_time.unix() : null,
      listing_time: listing_time,
      start_refund_time: listing_time,
      end_refund_time: data.end_refund_time?.unix(),

      // Whitelist Social Requirement
      self_twitter: data.self_twitter,
      self_group: data.self_group,
      self_channel: data.self_channel,
      self_retweet_post: data.self_retweet_post,
      self_retweet_post_hashtag: data.self_retweet_post_hashtag,
      partner_twitter: data.partner_twitter,
      partner_group: data.partner_group,
      partner_channel: data.partner_channel,
      partner_retweet_post: data.partner_retweet_post,
      partner_retweet_post_hashtag: data.partner_retweet_post_hashtag,
      gleam_link: data.gleam_link,

      // Forbidden Countries Setting
      forbidden_countries: data.forbidden_countries,

      announcement_time: data.announcement_time ? data.announcement_time.unix() : null,

      // Progress Display Setting
      token_sold_display: data.token_sold_display,
      progress_display: data.progress_display,

      // Lock Schedule Setting
      lock_schedule: data.lock_schedule,

      // Social Media
      medium_link: data.medium_link,
      twitter_link: data.twitter_link,
      telegram_link: data.telegram_link,
      discord_link: data.discord_link,
      youtube_link: data.youtube_link,
      facebook_link: data.facebook_link,
      participant_number: data.participant_number,

      // Claim Policy
      claim_policy: data.claim_policy,
      claim_guide: data.claim_guide,
      remaining_tokens: data.remaining_tokens,
      claim_type: data.claim_type,
      first_time_claim_phase: data.first_time_claim_phase
        ? data.first_time_claim_phase.unix()
        : null,

      // Free Time Settings
      freeBuyTimeSetting: {
        start_time_free_buy: data.start_time_free_buy ? data.start_time_free_buy.unix() : null,
        max_bonus_free_buy: data.max_bonus_free_buy,
      },
    };

    console.log("[updatePoolAfterDeloy] - Submit with data: ", submitData);

    let response = await updatePool(submitData, poolDetail.id);

    return response;
  };

  const handleUpdateAfterDeloy = async (data: any) => {
    setLoading(true);
    try {
      const response: any = await updatePoolAfterDeloy(data);
      if (response?.status === 200) {
        dispatch(alertSuccess("Successful!"));
        // history.push(adminRoute('/campaigns'));
        // window.location.reload();
      } else {
        dispatch(alertFailure("Fail!"));
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log("ERROR: ", e);
    }
  };

  // Create / Update Pool (Before Pool Deployed to Smart Contract)
  const handleCampaignCreateUpdate = () => {
    setNeedValidate(false);
    setTimeout(() => {
      if (poolDetail?.is_deploy) {
        handleSubmit(handleUpdateAfterDeloy)();
      } else {
        handleSubmit(handleFormSubmit)();
      }

      // // Show toast message has Validate Errors
      // const validateErrors = cloneDeep(errors);
      // setTimeout(() => {
      //   const hasAnyErrors = Object.keys(validateErrors).length > 0;
      //   if (hasAnyErrors) {
      //     dispatch(alertFailure('Validate Fail. Please check validate errors!'));
      //   }
      // }, 500);
    }, 100);
  };

  const getTokenInforDetail = async (token: string) => {
    const erc20Token = await getTokenInfo(token);
    let tokenInfo: any = {};
    if (erc20Token) {
      const { name, symbol, decimals, address } = erc20Token;
      tokenInfo = { name, symbol, decimals, address };
    }
    return tokenInfo;
  };

  // Deploy Pool And Update
  const handleDeloySubmit = async (data: any) => {
    if (poolDetail.is_deploy || deployed) {
      alert("Pool is deployed !!!");
      return false;
    }
    if (
      // eslint-disable-next-line no-restricted-globals
      !confirm(
        "The system will store the latest pool information.\n" + "Are you sure you want to deploy?"
      )
    ) {
      setNeedValidate(false);
      return false;
    }

    setLoadingDeploy(true);
    try {
      // Save data before deploy
      const response = await createUpdatePool(data);
      const tokenInfo = await getTokenInforDetail(data.token);

      const history = props.history;
      const minTier = data.minTier;
      let tierConfiguration = data.tierConfiguration || "[]";
      tierConfiguration = JSON.parse(tierConfiguration);
      tierConfiguration = tierConfiguration.map((currency: any, index: number) => {
        const item = {
          ...currency,
          currency: data.acceptCurrency,
        };
        if (index < minTier) {
          item.maxBuy = 0;
          item.minBuy = 0;
        }
        return item;
      });

      tierConfiguration = uniqBy(tierConfiguration, "name");

      const listing_time = data.listing_time ? data.listing_time.unix() : null;

      const submitData = {
        id: poolDetail.id,
        registed_by: loginUser?.wallet_address,

        // Pool general
        title: data.title,
        website: data.website,
        relationship_type: data.relationship_type,
        market_maker: data.market_maker,
        market_maker_icon: data.market_maker_icon,
        banner: data.banner,
        description: data.description,
        address_receiver: data.addressReceiver,

        // Token
        token: data.token,
        token_images: data.tokenImages,
        total_sold_coin: data.totalSoldCoin,
        coingecko_id: data.coingeckoId,

        // Rate
        token_by_eth: data.tokenRate,
        token_conversion_rate: data.tokenRate,

        // USDT Price
        price_usdt: data.price_usdt,
        display_price_rate: data.display_price_rate,

        // TokenInfo
        tokenInfo,

        // Time
        start_time: data.start_time ? data.start_time.unix() : null,
        finish_time: data.finish_time ? data.finish_time.unix() : null,
        release_time: data.release_time ? data.release_time.unix() : null,
        start_join_pool_time: data.start_join_pool_time ? data.start_join_pool_time.unix() : null,
        end_join_pool_time: data.end_join_pool_time ? data.end_join_pool_time.unix() : null,
        pre_order_min_tier: data.pre_order_min_tier,
        listing_time: listing_time,
        start_refund_time: listing_time,
        end_refund_time: data.end_refund_time?.unix(),
        start_pre_order_time: data.start_pre_order_time ? data.start_pre_order_time.unix() : null,

        // Types
        accept_currency: data.acceptCurrency,
        network_available: data.networkAvailable,
        network_claim: data.networkClaim,
        buy_type: data.buyType,
        pool_type: data.poolType || poolDetail?.pool_type,
        kyc_bypass: data.kyc_bypass,
        airdrop_network: data.airdropNetwork,

        // Tier
        min_tier: data.minTier,
        tier_configuration: tierConfiguration,

        // Wallet
        wallet: isEdit ? poolDetail?.wallet : {},

        // Progress Display Setting
        token_sold_display: data.token_sold_display,
        progress_display: data.progress_display,

        // Lock Schedule Setting
        lock_schedule: data.lock_schedule,

        // Social Media
        medium_link: data.medium_link,
        twitter_link: data.twitter_link,
        telegram_link: data.telegram_link,
        discord_link: data.discord_link,
        youtube_link: data.youtube_link,
        facebook_link: data.facebook_link,
        participant_number: data.participant_number,

        // Claim Policy
        claim_policy: data.claim_policy,
        claim_guide: data.claim_guide,
        remaining_tokens: data.remaining_tokens,
        claim_type: data.claim_type,
        first_time_claim_phase: data.first_time_claim_phase
          ? data.first_time_claim_phase.unix()
          : null,

        // Free Time Settings
        freeBuyTimeSetting: {
          start_time_free_buy: data.start_time_free_buy ? data.start_time_free_buy.unix() : null,
          max_bonus_free_buy: data.max_bonus_free_buy,
        },
      };

      console.log("[handleDeloySubmit] - Submit with data: ", submitData, poolDetail);

      await dispatch(deployPool(submitData, history));
      setLoadingDeploy(false);
      setDeployed(true);
      window.location.reload();
    } catch (e) {
      setLoadingDeploy(false);
      console.log("ERROR: ", e);
    }
  };

  // Deploy Pool And Update claim pool on different network
  const handleDeloyClaimPoolSubmit = async (data: any) => {
    if (!(poolDetail.is_deploy || deployed)) {
      alert("Buying pool need to be deployed first");
      return false;
    }
    if (poolDetail.network_available === poolDetail.network_claim) {
      alert("No need to deploy another seperate pool");
      return false;
    }
    if (
      // eslint-disable-next-line no-restricted-globals
      !confirm(
        "The system will store the latest pool information.\n" + "Are you sure you want to deploy?"
      )
    ) {
      setNeedValidate(false);
      return false;
    }

    setLoadingDeploy(true);
    try {
      // Save data before deploy
      await createUpdatePool(data);
      const tokenInfo = await getTokenInforDetail(tokenAddress);

      const history = props.history;

      const submitData = {
        id: poolDetail.id,

        start_time: data.start_time ? data.start_time.unix() : null,
        finish_time: data.finish_time ? data.finish_time.unix() : null,
        start_pre_order_time: data.start_pre_order_time ? data.start_pre_order_time.unix() : null,

        // Token
        token: tokenAddress,
        address_receiver: poolDetail?.address_receiver,

        // TokenInfo
        tokenInfo,

        // Rate
        token_by_eth: tokenRate,
        token_conversion_rate: tokenRate,

        // Types
        accept_currency: data.acceptCurrency,

        network_available: data.networkAvailable,
        network_claim: data.networkClaim,

        // Wallet
        wallet: isEdit ? poolDetail?.wallet : {},
      };

      console.log("[handleDeloyClaimPoolSubmit] - Submit with data: ", submitData, poolDetail);

      await dispatch(deployClaimPool(submitData, history));
      setLoadingDeploy(false);
      window.location.reload();
    } catch (e) {
      setLoadingDeploy(false);
      console.log("ERROR: ", e);
    }
  };

  const handlerDeploy = () => {
    setNeedValidate(true);
    setTimeout(() => {
      handleSubmit(handleDeloySubmit)();
    }, 100);
  };

  const handlerDeployClaimPool = () => {
    setTimeout(() => {
      handleSubmit(handleDeloyClaimPoolSubmit)();
    }, 100);
  };

  const watchBuyType = watch("buyType");
  const watchIsPrivate = watch("isPrivate");
  const isDeployed = !!poolDetail?.is_deploy;

  return (
    <>
      <div>
        <div className={classes.boxBottom}>
          <ul className={`multilTabBottom ${classes.navBottom}`}>
            <li
              onClick={() => setActiveTab(ACTIVE_TABS.PROJECT_INFO)}
              className={activeTab === ACTIVE_TABS.PROJECT_INFO ? "active" : ""}
            >
              PROJECT INFO
            </li>
            <li
              onClick={() => setActiveTab(ACTIVE_TABS.TIME_SETTINGS)}
              className={activeTab === ACTIVE_TABS.TIME_SETTINGS ? "active" : ""}
            >
              TIME SETTINGS
            </li>
            <li
              onClick={() => setActiveTab(ACTIVE_TABS.USER_LIST)}
              className={activeTab === ACTIVE_TABS.USER_LIST ? "active" : ""}
            >
              USER LIST
            </li>
          </ul>

          <TabProjectInfo
            showTab={activeTab === ACTIVE_TABS.PROJECT_INFO}
            poolDetail={poolDetail}
            setValue={setValue}
            errors={errors}
            control={control}
            register={register}
            watch={watch}
            token={token}
            setToken={setToken}
            getValues={getValues}
            needValidate={needValidate}
            watchIsPrivate={watchIsPrivate}
            getTokenInforDetail={getTokenInforDetail}
            handlerDeployClaimPool={handlerDeployClaimPool}
            isDeployed={isDeployed}
          />

          <TabTimeSettings
            showTab={activeTab === ACTIVE_TABS.TIME_SETTINGS}
            poolDetail={poolDetail}
            setValue={setValue}
            errors={errors}
            control={control}
            register={register}
            watch={watch}
            token={token}
            setToken={setToken}
            getValues={getValues}
            needValidate={needValidate}
            watchIsPrivate={watchIsPrivate}
          />

          <TabUserList
            showTab={activeTab === ACTIVE_TABS.USER_LIST}
            isEdit={isEdit}
            poolDetail={poolDetail}
            watchBuyType={watchBuyType}
            register={register}
            watch={watch}
            setValue={setValue}
            errors={errors}
            control={control}
          />
        </div>

        <Grid container spacing={2}>
          <button
            disabled={
              !isEdit ||
              !poolDetail?.id ||
              poolDetail?.is_deploy ||
              loading ||
              loadingDeploy ||
              deployed
            }
            className={
              !isEdit || poolDetail?.is_deploy || deployed
                ? classes.formButtonDeployed
                : classes.formButtonDeploy
            }
            onClick={handlerDeploy}
          >
            {loadingDeploy && <CircularProgress size={25} />}
            {!loadingDeploy && "Deploy"}
          </button>

          <button
            disabled={loading || loadingDeploy}
            className={classes.formButtonUpdatePool}
            onClick={handleCampaignCreateUpdate}
          >
            {loading || loadingDeploy ? (
              <CircularProgress size={25} />
            ) : isEdit ? (
              "Update"
            ) : (
              "Create"
            )}
          </button>

          {/* Button Update with disable after deploy */}
          {/*<button*/}
          {/*  disabled={loading || loadingDeploy || poolDetail?.is_deploy}*/}
          {/*  className={poolDetail?.is_deploy ? classes.formButtonDeployed : classes.formButtonUpdatePool}*/}
          {/*  onClick={handleCampaignCreateUpdate}*/}
          {/*>*/}
          {/*  {*/}
          {/*    (loading || loadingDeploy) ? <CircularProgress size={25} /> : (isEdit ? 'Update' : 'Create')*/}
          {/*  }*/}
          {/*</button>*/}
        </Grid>
      </div>
    </>
  );
}

export default withRouter(PoolForm);
