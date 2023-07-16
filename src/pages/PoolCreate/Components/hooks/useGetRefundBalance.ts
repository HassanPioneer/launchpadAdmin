import { useCallback, useState } from "react";
import { getPoolContract, getETHBalance, getErc20Contract } from "../../../../services/web3"
import BigNumber from "bignumber.js"
import {
    POOL_TYPE, NATIVE_TOKEN_ADDRESS,
    ACCEPT_CURRENCY,
    USDC_ADDRESS,
    USDC_BSC_ADDRESS, USDC_POLYGON_ADDRESS,
    USDT_AVALANCHE_ADDRESS,
    USDT_ADDRESS,
    USDT_BSC_ADDRESS, USDT_POLYGON_ADDRESS,
    BUSD_BSC_ADDRESS,
    USDT_ARBITRUM_ADDRESS
} from "../../../../constants";
import { reject } from "lodash";

const useGetRefundBalance = (props: any) => {
    const { poolDetail } = props;
    const [refundBalance, setRefundBalance] = useState<any>();
    const [rawRefundBalance, setRawRefundBalance] = useState<any>();
    const [currencyAddress, setCurrencyAddress] = useState<any>();
    const [contractBalance, setContractBalance] = useState<any>();
    const [rawContractBalance, setRawContractBalance] = useState<any>();
    const [depositBalance, setDepositBalance] = useState<any>();
    const [rawDepositBalance, setRawDepositBalance] = useState<any>();
    const [totalRefundToken, setTotalRefundToken] = useState<any>();

    const getRefundBalance = useCallback(async () => {
        try {
            const currencyInfo: any = {
                eth: {
                    usdt: {
                        address: USDT_ADDRESS,
                        decimal: 6
                    },
                    usdc: {
                        address: USDC_ADDRESS,
                        decimal: 6
                    },
                },
                bsc: {
                    usdt: {
                        address: USDT_BSC_ADDRESS,
                        decimal: 18
                    },
                    busd: {
                        address: BUSD_BSC_ADDRESS,
                        decimal: 18
                    },
                    usdc: {
                        address: USDC_BSC_ADDRESS,
                        decimal: 18
                    },
                },
                polygon: {
                    usdt: {
                        address: USDT_POLYGON_ADDRESS,
                        decimal: 6
                    },
                    usdc: {
                        address: USDC_POLYGON_ADDRESS,
                        decimal: 6
                    }
                },
                avalanche: {
                    usdt: {
                        address: USDT_AVALANCHE_ADDRESS,
                        decimal: 6
                    }
                },
                arbitrum: {
                    usdt: {
                        address: USDT_ARBITRUM_ADDRESS,
                        decimal: 6
                    }
                }
            }

            const currencyAddress = poolDetail.accept_currency == ACCEPT_CURRENCY.ETH ? NATIVE_TOKEN_ADDRESS : currencyInfo[poolDetail.network_available][poolDetail.accept_currency].address
            const currencyDecimal = poolDetail.accept_currency == ACCEPT_CURRENCY.ETH ? 18 : currencyInfo[poolDetail.network_available][poolDetail.accept_currency].decimal

            const poolContract = getPoolContract({ networkAvailable: poolDetail.network_available, poolHash: poolDetail.campaign_hash, isClaimable: poolDetail.pool_type == POOL_TYPE.CLAIMABLE })
            const erc20Contract = currencyAddress != NATIVE_TOKEN_ADDRESS ? getErc20Contract({ networkAvailable: poolDetail.network_available, erc20TokenAddress: currencyAddress }) : undefined;

            if (!poolContract) throw new Error('contract not found')

            const [refundCurrency, totalRefundToken, contractBalance] = await Promise.all([
                poolContract.methods.refundCurrency(currencyAddress).call(),
                poolContract.methods.getTotalRefundToken(currencyAddress).call(),
                currencyAddress == NATIVE_TOKEN_ADDRESS ? getETHBalance(poolDetail.campaign_hash) : erc20Contract?.methods.balanceOf(poolDetail.campaign_hash).call()
            ])

            const rawRefundBalance = refundCurrency
            setRefundBalance(new BigNumber(refundCurrency).div(new BigNumber(10).pow(currencyDecimal)).toFixed())
            setRawRefundBalance(rawRefundBalance)
            setCurrencyAddress(currencyAddress)

            const rawContractBalance = currencyAddress == NATIVE_TOKEN_ADDRESS ? new BigNumber(contractBalance).times(new BigNumber(10).pow(currencyDecimal)).toFixed() : new BigNumber(contractBalance).toFixed()

            let rawDepositBalance: any = new BigNumber(rawRefundBalance).minus(new BigNumber(rawContractBalance))
            rawDepositBalance = rawDepositBalance.lte(new BigNumber(0)) ? '0' : rawDepositBalance.toFixed()

            setRawContractBalance(rawContractBalance)
            setContractBalance(new BigNumber(rawContractBalance).div(new BigNumber(10).pow(currencyDecimal)).toFixed())

            setDepositBalance(new BigNumber(rawDepositBalance).div(new BigNumber(10).pow(currencyDecimal)).toFixed())
            setRawDepositBalance(rawDepositBalance)
            setTotalRefundToken(new BigNumber(totalRefundToken).div(new BigNumber(10).pow(poolDetail.decimals)).toFixed())

            // console.log({depositBalance})
        } catch (error: any) {
            console.log('error: ', error.message)
        }
    }, [poolDetail]);

    return {
        refundBalance, rawRefundBalance, contractBalance, rawDepositBalance, depositBalance, rawContractBalance, currencyAddress, totalRefundToken, getRefundBalance
    }
};


export default useGetRefundBalance;
