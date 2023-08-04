import { Grid } from "@material-ui/core";
import { POOL_IS_PRIVATE } from "../../../constants";
import AcceptCurrency from "../Components/AcceptCurrency";
import AddressReceiveMoney from "../Components/AddressReceiveMoney";
import AirdropNetwork from "../Components/AirdropNetwork";
import BuyType from "../Components/BuyType";
import DisplayPoolSwitch from "../Components/DisplayPoolSwitch";
import ExchangeRate from "../Components/ExchangeRate";
import ForbiddenCountry from "../Components/ForbiddenCountry/ForbiddenCountry";
import KycRequired from "../Components/KycRequired";
import NetworkAvailable from "../Components/NetworkAvailable";
import ParticipantNumber from "../Components/ParticipantNumber";
import PoolBanner from "../Components/PoolBanner";
import PoolDescription from "../Components/PoolDescription";
import PoolHash from "../Components/PoolHash";
import PoolClaimHash from "../Components/PoolClaimHash";
import PoolName from "../Components/PoolName";
import PoolWebsite from "../Components/PoolWebsite";
import PoolRelationship from "../Components/PoolRelationship";
import PoolMarketMaker from "../Components/PoolMarketMaker";
import PoolMarketMakerIcon from "../Components/PoolMarketMakerIcon";
import PrivatePoolSetting from "../Components/PrivatePoolSetting";
import SocialSetting from "../Components/SocialSetting/SocialSetting";
import TokenAddress from "../Components/TokenAddress";
import TokenLogo from "../Components/TokenLogo";
import TokenCoingeckoId from "../Components/TokenCoingeckoId";

import TokenSymbol from "../Components/TokenSymbol";
import TotalCoinSold from "../Components/TotalCoinSold";
import GleamRequirement from "../Components/WhitelistSocialRequirement/GleamRequirement";
import useStyles from "../style";
import ClaimNetwork from "../Components/ClaimNetwork";
import { useMemo } from "react";
import ProgressDisplaySetting from "../Components/ProgressDisplaySetting/ProgressDisplaySetting";
import DepositRefundBalance from "../Components/DepositRefundBalance/DepositBalance";
import WithdrawRemainingToken from "../Components/WithdrawRemainingToken";

const TabProjectInfo = (props: any) => {
  const classes = useStyles();

  const {
    showTab,
    poolDetail,
    setValue,
    errors,
    control,
    register,
    watch,
    token,
    setToken,
    getValues,
    needValidate,
    watchIsPrivate,
    getTokenInforDetail,
    handlerDeployClaimPool,
    isDeployed,
  } = props;

  const poolType = watchIsPrivate ? Number(watchIsPrivate) : 0;
  const poolForCommunity =
    poolType === POOL_IS_PRIVATE.COMMUNITY ||
    poolType === POOL_IS_PRIVATE.EVENT;
  const availableNetwork = watch("networkAvailable");
  const claimNetwork = watch("networkClaim");
  const duoNetworkPool = useMemo(() => {
    return availableNetwork !== claimNetwork;
  }, [availableNetwork, claimNetwork]);

  return (
    <div style={{ display: showTab ? "inherit" : "none" }}>
      <Grid container spacing={2}>
        <Grid item xs={6} className={classes.exchangeRate}>
          {!!poolDetail?.id && (
            <DisplayPoolSwitch
              poolDetail={poolDetail}
              register={register}
              setValue={setValue}
              errors={errors}
              control={control}
            />
          )}

          <PoolName
            poolDetail={poolDetail}
            register={register}
            setValue={setValue}
            errors={errors}
          />

          <PoolBanner
            poolDetail={poolDetail}
            register={register}
            setValue={setValue}
            errors={errors}
          />

          <PoolWebsite
            poolDetail={poolDetail}
            register={register}
            setValue={setValue}
            errors={errors}
          />

          <PoolRelationship
            poolDetail={poolDetail}
            register={register}
            setValue={setValue}
            errors={errors}
          />

          <PoolMarketMaker
            poolDetail={poolDetail}
            register={register}
            setValue={setValue}
            errors={errors}
          />

          <PoolMarketMakerIcon
            poolDetail={poolDetail}
            register={register}
            setValue={setValue}
            errors={errors}
          />

          <TokenSymbol
            poolDetail={poolDetail}
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
            getTokenInforDetail={getTokenInforDetail}
          />

          <TokenLogo
            poolDetail={poolDetail}
            register={register}
            errors={errors}
          />

          <TokenCoingeckoId
            poolDetail={poolDetail}
            register={register}
            errors={errors}
          />

          <TotalCoinSold
            poolDetail={poolDetail}
            register={register}
            setValue={setValue}
            errors={errors}
          />

          {!!poolDetail?.is_deploy && (
            <ProgressDisplaySetting
              poolDetail={poolDetail}
              register={register}
              setValue={setValue}
              errors={errors}
            />
          )}
        </Grid>
        <Grid item xs={6} className={classes.exchangeRate}>
          <PoolHash poolDetail={poolDetail} duoNetworkPool={duoNetworkPool} watch={watch} />
          {duoNetworkPool && (
            <PoolClaimHash
              poolDetail={poolDetail}
              handlerDeployClaimPool={handlerDeployClaimPool}
            />
          )}

          <TokenAddress
            poolDetail={poolDetail}
            register={register}
            token={token}
            setToken={setToken}
            setValue={setValue}
            getValues={getValues}
            errors={errors}
            watch={watch}
            needValidate={needValidate}
          />

          <AddressReceiveMoney
            poolDetail={poolDetail}
            register={register}
            setValue={setValue}
            errors={errors}
            needValidate={needValidate}
          />

          <ExchangeRate
            poolDetail={poolDetail}
            register={register}
            token={token}
            setValue={setValue}
            errors={errors}
            control={control}
            watch={watch}
            needValidate={needValidate}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={6} className={classes.exchangeRate}>
          <BuyType
            poolDetail={poolDetail}
            setValue={setValue}
            errors={errors}
            control={control}
          />

          <PrivatePoolSetting
            poolDetail={poolDetail}
            setValue={setValue}
            errors={errors}
            control={control}
          />

          {/* <TokenType
            poolDetail={poolDetail}
            setValue={setValue}
            errors={errors}
            control={control}
          /> */}

          <NetworkAvailable
            poolDetail={poolDetail}
            setValue={setValue}
            errors={errors}
            control={control}
            needValidate={needValidate}
          />

          <ClaimNetwork
            poolDetail={poolDetail}
            setValue={setValue}
            errors={errors}
            control={control}
            needValidate={needValidate}
            watch={watch}
          />

          <AcceptCurrency
            poolDetail={poolDetail}
            setValue={setValue}
            errors={errors}
            control={control}
            watch={watch}
          />

          <AirdropNetwork
            poolDetail={poolDetail}
            setValue={setValue}
            control={control}
          />

          <KycRequired
            poolDetail={poolDetail}
            setValue={setValue}
            errors={errors}
            control={control}
            watch={watch}
          />
        </Grid>
        <Grid item xs={6} className={classes.exchangeRate}>
          <ForbiddenCountry
            poolDetail={poolDetail}
            register={register}
            setValue={setValue}
            errors={errors}
            control={control}
            watch={watch}
          />
          {isDeployed && (
            <DepositRefundBalance
              poolDetail={poolDetail}
              setValue={setValue}
              errors={errors}
              control={control}
              watch={watch}
            />
          )}
          {isDeployed && (
            <WithdrawRemainingToken
              poolDetail={poolDetail}
            />
          )}
          {/* {isDeployed && (
            <WithdrawRefundBalance
              poolDetail={poolDetail}
              setValue={setValue}
              errors={errors}
              control={control}
              watch={watch}
            />
          )} */}
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={6} className={classes.exchangeRate}>
          <SocialSetting
            poolDetail={poolDetail}
            setValue={setValue}
            errors={errors}
            control={control}
            watch={watch}
            register={register}
          />

          {poolForCommunity && (
            <ParticipantNumber
              poolDetail={poolDetail}
              register={register}
              setValue={setValue}
              getValues={getValues}
              errors={errors}
              control={control}
              watch={watch}
            />
          )}
        </Grid>
        <Grid item xs={6} className={classes.exchangeRate}>
          <GleamRequirement
            poolDetail={poolDetail}
            register={register}
            setValue={setValue}
            errors={errors}
            control={control}
            watch={watch}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <div className=""></div>
        </Grid>

        <Grid item xs={6}></Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className={classes.exchangeRate}>
            <PoolDescription
              poolDetail={poolDetail}
              register={register}
              setValue={setValue}
              errors={errors}
              control={control}
            />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default TabProjectInfo;
