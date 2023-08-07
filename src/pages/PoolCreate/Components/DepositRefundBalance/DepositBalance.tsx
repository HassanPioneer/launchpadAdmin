import React, { useEffect, useState } from 'react';
import DepositButton from "./DepositButton";
import useStyles from "../../style";
import useGetRefundBalance from "../hooks/useGetRefundBalance"
import { NETWORK_AVAILABLE } from "../../../../constants"

function DepositRefundBalance(props: any) {
    const classes = useStyles();
    const {
        setValue, errors, control, watch,
        poolDetail
    } = props;

    const [acceptCurrency, setAcceptCurrency] = useState<any>();
    const [tokenSymbol, setTokenSymbol] = useState<any>();

    const isDeployed = !!poolDetail?.is_deploy;

    const {
        refundBalance, contractBalance, rawDepositBalance, depositBalance, currencyAddress, totalRefundToken, getRefundBalance
    } = useGetRefundBalance({ poolDetail });

    useEffect(() => {
        if (poolDetail) {
            getRefundBalance()
            setAcceptCurrency(poolDetail.accept_currency == NETWORK_AVAILABLE.ETH ? poolDetail.network_available : poolDetail.accept_currency)
            setTokenSymbol(poolDetail.symbol)
        }
    }, [poolDetail]);

    if (!isDeployed) return <></>;

    return (
        <>
            <div className={classes.formControl}>
                <br />
                <label className={classes.exchangeRateTitle}>Refund Tokens</label>
                <br />
                <br />

                <label className={classes.formControlLabel}>Refunding Amount: {refundBalance} {acceptCurrency}</label>
                <br />
                <label className={classes.formControlLabel}>Contract Balance: {contractBalance} {acceptCurrency}</label>
                <br />
                <label className={classes.formControlLabel}>Deposit Amount: {depositBalance} {acceptCurrency}</label>
                <br />
                <label className={classes.formControlLabel}>Total Refunding Token: {totalRefundToken} {tokenSymbol}</label>
                <br />
                <br />
                <DepositButton
                    poolDetail={poolDetail}
                    rawDepositBalance={rawDepositBalance}
                    currencyAddress={currencyAddress}
                    disabled={!rawDepositBalance || +rawDepositBalance == 0 || !currencyAddress}
                />
            </div>
        </>
    );
}

export default DepositRefundBalance;
