import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import campaignABI from "../../../../abi/Swap/Campaign.json";
import { getContractInstance } from "../../../../services/web3";
import useStyles from "../../style";
import useGetRefundBalance from "../hooks/useGetRefundBalance";
import WithdrawButton from "./WithdrawButton";
import React from 'react';

function WithdrawRefundBalance(props: any) {
  const classes = useStyles();
  const { setValue, errors, control, watch, poolDetail } = props;
  const { data: loginUser } = useSelector((state: any) => state.user);

  const [isOwner, setIsOwner] = useState<boolean>(false);

  const isDeployed = !!poolDetail?.is_deploy;

  const { currencyAddress, rawContractBalance, getRefundBalance } =
    useGetRefundBalance({
      poolDetail,
      connectedAccount: loginUser?.wallet_address,
    });

  const getOwner = async () => {
    const campaignContract = getContractInstance(
      campaignABI,
      poolDetail?.campaign_hash
    );
    const owner = await campaignContract?.methods.owner().call();
    setIsOwner(owner === loginUser?.wallet_address);
  };
  useEffect(() => {
    if (poolDetail) {
      getRefundBalance();
      getOwner();
    }
  }, [poolDetail]);

  if (!isDeployed) return <></>;

  return (
    <>
      <div className={classes.formControl} style={{marginTop: 20}}>
        <WithdrawButton
          poolDetail={poolDetail}
          currencyAddress={currencyAddress}
          disabled={
            !isOwner ||
            !currencyAddress ||
            !rawContractBalance ||
            +rawContractBalance === 0
          }
        />
      </div>
    </>
  );
}

export default WithdrawRefundBalance;
