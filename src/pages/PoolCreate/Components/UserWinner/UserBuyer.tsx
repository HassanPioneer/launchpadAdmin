import React, { useState, useEffect, useMemo, useCallback } from 'react'
import TableContainer from "@material-ui/core/TableContainer"
import Paper from "@material-ui/core/Paper"
import Table from "@material-ui/core/Table"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import TableCell from "@material-ui/core/TableCell"
import TableBody from "@material-ui/core/TableBody"
import { DatePicker } from "antd";
import moment from "moment";
import { getWinnerUser } from "../../../../request/participants";
import useMapMaxBuyTier from "../hooks/useMapMaxBuyTier";
import { Grid, Button } from "@material-ui/core"
import { useCommonStyle } from "../../../../styles"
import { getPoolContract, getReadOnlyPoolContract, getReadOnlyTokenContract, getBlockByTime, getBlockByNumber } from "../../../../services/web3"
import { withRouter } from "react-router"
import BigNumber from "bignumber.js"
import useStyles from "../../style"
import { alertFailure, alertSuccess } from "../../../../store/actions/alert"
import { useDispatch, useSelector } from "react-redux"
import { MAPPING_CURRENCY_ADDRESS, NATIVE_TOKEN_ADDRESS } from "../../../../constants"

import useStylesTable from './style_table'
import {etherscanRoute} from "../../../../utils"
import Link from "@material-ui/core/Link"
// @ts-ignore
import { CSVLink } from "react-csv"

function UserReverse(props: any) {
  const dispatch = useDispatch()
  const classes = useStyles()
  const commonStyle = useCommonStyle()
  const classesTable = useStylesTable()
  const { poolDetail } = props
  const { data: loginUser } = useSelector((state: any) => state.user)

  const [poolAddress, setPoolAddress] = useState('')
  const [startBlockNumber, setStartBlockNumber] = useState(0)
  const [endTime, setEndTime] = useState<any>(null)
  const [endBlockNumber, setEndBlockNumber] = useState(0)
  const [step, setStep] = useState(1000)

  const [startBlock, setStartBlock] = useState<any>(null)
  const [endBlock, setEndBlock] = useState<any>(null)

  const [loadingInfo, setLoadingInfo] = useState(false)
  const [loadingBuyer, setLoadingBuyer] = useState(false)
  const [buyers, setBuyers] = useState<Array<any>>([])
  const [purchasedEvents, setPurchasedEvents] = useState<Array<any>>([])
  const [totalBought, setTotalBought] = useState('')
  const [fetchedContract, setFetchedContract] = useState('')
  const [isFetchedAll, setIsFetchedAll] = useState(false)
  const [poolInfo, setPoolInfo] = useState<any | null>(null)
  const [tokenInfo, setTokenInfo] = useState<any | null>(null)
  const [paidTokenInfo, setPaidTokenInfo] = useState<any | null>(null)

  const { maxBuyTiersMapping } = useMapMaxBuyTier({ poolDetail });

  const loadPoolInfo = async (poolAddress: string, poolNetwork: string) => {
    if (!poolAddress || !poolNetwork) {
      setPoolInfo(null)
      setLoadingInfo(false)
      return
    }
    try {
      setPoolInfo(null)
      setLoadingInfo(true)

      const poolInstance = await getReadOnlyPoolContract({
        networkAvailable: poolNetwork,
        poolHash: poolAddress,
        isClaimable: true
      })

      if (!poolInstance) {
        setPoolInfo(null)
        setLoadingInfo(false)
        return
      }

      const [tokenAddress, tokenSold, openTime, closeTime] = await Promise.all([
        poolInstance.methods.token().call(),
        poolInstance.methods.tokenSold().call(),
        poolInstance.methods.openTime().call(),
        poolInstance.methods.closeTime().call(),
      ])

      const [startBlock, endBlock] = await Promise.all([
        getBlockByTime(poolNetwork, Number(openTime) - 60),
        getBlockByTime(poolNetwork, Number(closeTime) + 60),
      ])

      setEndTime(moment.unix(closeTime))
      setStartBlockNumber(startBlock?.number || 0)
      setEndBlockNumber(endBlock?.number || 0)

      let claimable, allowChangePurchasedState
      try {
        [claimable, allowChangePurchasedState] = await Promise.all([
          poolInstance.methods.claimable().call(),
          poolInstance.methods.allowChangePurchasedState().call(),
        ])
      } catch (err) {
        claimable = true
        allowChangePurchasedState = false
      }
      setLoadingInfo(false)
      setPoolInfo({
        tokenAddress,
        tokenSold,
        claimable,
        allowChangePurchasedState
      })
    } catch (err) {
      console.log(err)
      setLoadingInfo(false)
    }
  }

  const updateEndCrawlBlock = async () => {
    if (!endTime || !endTime.unix()) return

    const endBlock = await getBlockByTime(poolNetwork, Number(endTime.unix()) + 60)
    setEndBlockNumber(endBlock?.number || 0)
  }

  const loadTokenInfo = async (tokenAddress: string, tokenNetwork: string) => {
    if (!tokenAddress || !tokenNetwork) {
      setTokenInfo(null)
      return
    }

    const tokenInstance = await getReadOnlyTokenContract({
      networkAvailable: tokenNetwork,
      tokenAddress: tokenAddress,
    })

    if (!tokenInstance) {
      setTokenInfo(null)
      return
    }

    const [symbol, decimals] = await Promise.all([
      tokenInstance.methods.symbol().call(),
      tokenInstance.methods.decimals().call(),
    ])

    setTokenInfo({
      tokenAddress,
      symbol,
      decimals,
    })
  }

  const poolNetwork = useMemo(() => {
    return poolAddress.toLowerCase() === poolDetail?.campaign_claim_hash?.toLowerCase() ? poolDetail.network_claim : poolDetail.network_available
  }, [poolAddress, poolDetail])

  const loadPaidTokenInfo = useCallback(async () => {
    let paidTokenAddress = MAPPING_CURRENCY_ADDRESS[poolNetwork]?.[poolDetail?.accept_currency]
    if (!paidTokenAddress) {
      setPaidTokenInfo({
        address: NATIVE_TOKEN_ADDRESS,
        decimals: 18
      })
      return
    }

    const tokenInstance = await getReadOnlyTokenContract({
      networkAvailable: poolNetwork,
      tokenAddress: paidTokenAddress,
    })

    if (!tokenInstance) {
      setPaidTokenInfo(null)
      return
    }

    const decimals = await tokenInstance.methods.decimals().call()
    setPaidTokenInfo({
      address: paidTokenAddress,
      decimals
    })
    return {
      address: paidTokenAddress,
      decimals
    }
  }, [poolNetwork, poolDetail])

  useEffect(() => {
    loadPaidTokenInfo()
  }, [loadPaidTokenInfo])

  useEffect(() => {
    (async ()=> {
      if (!startBlockNumber) return

      const block = await getBlockByNumber(startBlockNumber, poolNetwork)
      setStartBlock(block)
    }
    )()
  }, [startBlockNumber, poolNetwork])

  useEffect(() => {
    (async ()=> {
      if (!endBlockNumber) return

      const block = await getBlockByNumber(endBlockNumber, poolNetwork)
      setEndBlock(block)
    }
    )()
  }, [endBlockNumber, poolNetwork])

  useEffect(() => {
    if (!poolInfo || !poolInfo?.tokenAddress || !poolNetwork) {
      setTokenInfo(null)
    }

    loadTokenInfo(poolInfo?.tokenAddress, poolNetwork)
    // loadPaidTokenInfo()
  }, [poolInfo, poolNetwork])

  useEffect(() => {
    loadPoolInfo(
      poolAddress,
      poolAddress.toLowerCase() === poolDetail?.campaign_claim_hash?.toLowerCase() ? poolDetail.network_claim : poolDetail.network_available
    )
  }, [poolAddress, poolDetail])

  const csvReport = useMemo(() => {
    const headers = [
      { label: "Wallet Address", key: "walletAddress" },
      { label: "Purchased (wei)", key: "purchased" },
      { label: "Purchased", key: "beautifyPurchased" },
      { label: "Claimed (wei)", key: "claimed" },
      { label: "Claimed", key: "beautifyClaimed" },
      { label: "Invested (wei)", key: "invested" },
      { label: "Invested", key: "beautifyInvested" },
    ]


    const beautifyBuyers = buyers.map(b => {
      return {
        beautifyPurchased: new BigNumber(b.purchased).div(new BigNumber(10).pow(tokenInfo?.decimals)).toFixed(2),
        beautifyClaimed: new BigNumber(b.claimed).div(new BigNumber(10).pow(tokenInfo?.decimals)).toFixed(2),
        beautifyInvested: new BigNumber(b.invested).div(new BigNumber(10).pow(paidTokenInfo?.decimals)).toFixed(2),
        ...b
      }
    })

    return {
      data: beautifyBuyers,
      headers: headers,
      filename: `redkite_pool_${poolDetail.id}_buyers.csv`
    }
  }, [buyers, poolDetail, tokenInfo, paidTokenInfo])


  const csvEventsReport = useMemo(() => {
    const headers = [
      { label: "Type", key: "type" },
      { label: "Wallet Address", key: "walletAddress" },
      { label: "Level", key: "level" },
      { label: "Allocation", key: "allocation" },
      { label: "Invested ($)", key: "currencyAmount" },
      { label: "Bought (tokenAmount)", key: "tokenAmount" },
      { label: "Refund ($)", key: "refundAmount" },
    ]

    const beautifyEvents = purchasedEvents.map(ev => {
      const walletAddress = ev.event === 'TokenPurchaseByToken' ? ev.returnValues.purchaser : ev.returnValues.user
      const buyer = buyers.find(b => b.walletAddress.toLowerCase() === walletAddress.toLowerCase())

      return {
        walletAddress,
        level: buyer?.level,
        lottery_ticket: buyer?.lottery_ticket,
        allocation: new BigNumber(maxBuyTiersMapping[buyer?.level || 0]).multipliedBy(buyer?.lottery_ticket || 0).toFixed(),

        type: ev.event,
        currencyAmount: ev.event === 'TokenPurchaseByToken' ?  new BigNumber(ev.returnValues.value).div(new BigNumber(10).pow(paidTokenInfo?.decimals)).toFixed(2) : 0,
        tokenAmount: ev.event === 'TokenPurchaseByToken' ?  new BigNumber(ev.returnValues.amount).div(new BigNumber(10).pow(tokenInfo?.decimals)).toFixed(2) : 0,
        refundAmount: ev.event === 'RefundToken' ? new BigNumber(ev.returnValues.currencyAmount).div(new BigNumber(10).pow(paidTokenInfo?.decimals)).toFixed(2) : 0,
      }
    })

    return {
      data: beautifyEvents,
      headers: headers,
      filename: `redkite_pool_${poolDetail.id}_purchasedEvents.csv`
    }
  }, [purchasedEvents, maxBuyTiersMapping, poolDetail, buyers, tokenInfo, paidTokenInfo])

  const fetchBuyer = async (e: any) => {
    if (!poolAddress || !poolAddress || loadingBuyer) {
      return
    }

    setFetchedContract('')
    setBuyers([])
    setTotalBought('total')
    setIsFetchedAll(false)

    try {
      setLoadingBuyer(true)

      const poolInstance = await getReadOnlyPoolContract({
        networkAvailable: poolNetwork,
        poolHash: poolAddress,
        isClaimable: true
      })

      if (!poolInstance) {
        return
      }

      let purchasers: string[] = []
      let fromBlockNumber = startBlockNumber
      let toBlockNumber = startBlockNumber + step > endBlockNumber ? endBlockNumber : startBlockNumber + step
      let evs: any[] = []

      do {
        let events = await poolInstance.getPastEvents('allEvents', {
          fromBlock: fromBlockNumber,
          toBlock: toBlockNumber
        }, function(err) { if (err) console.log(err) })
        events.forEach((ev: any)=> {
          if (ev?.event !== 'TokenPurchaseByToken' && ev?.event !== 'RefundToken') return

          evs.push(ev)

          if (ev?.event !== 'TokenPurchaseByToken') return
          if (!ev?.returnValues?.purchaser) return
          if (purchasers.includes(ev?.returnValues?.purchaser)) return

          purchasers.push(ev?.returnValues?.purchaser)
        })

        fromBlockNumber = toBlockNumber + 1
        toBlockNumber = fromBlockNumber + step > endBlockNumber ? endBlockNumber : fromBlockNumber + step

        await new Promise(r => setTimeout(r, 1000))

      } while (fromBlockNumber <= toBlockNumber)

      console.log('Total purchasers:', purchasers.length)

      setPurchasedEvents(evs)

      let paidTokenAddress = MAPPING_CURRENCY_ADDRESS[poolNetwork]?.[poolDetail?.accept_currency]
      if (!paidTokenAddress) {
        paidTokenAddress = NATIVE_TOKEN_ADDRESS
      }

      let position = 0
      let batchSize = 100
      let rows = []

      do {
        console.log('Fetching', position, position + batchSize, purchasers.length)
        rows.push(...(await Promise.all(purchasers.slice(position, position + batchSize).map(async (walletAddress: string) => {
          const [purchased, claimed, invested, winnerData] = await Promise.all([
            poolInstance.methods.userPurchased(walletAddress).call(),
            poolInstance.methods.userClaimed(walletAddress).call(),
            poolInstance.methods.investedAmountOf(paidTokenAddress, walletAddress).call(),
            getWinnerUser(poolDetail.id,{search_term: walletAddress})
          ])

          let userData = winnerData?.data?.[0]

          return {
            walletAddress,
            purchased,
            claimed,
            invested,
            level: userData?.level,
            lottery_ticket: userData?.lottery_ticket,
          }
        }))))
        position += batchSize
        console.log('Sleeping')
        await new Promise(r => setTimeout(r, 1000))
      } while (position <= purchasers.length)

      const total = rows.reduce((prev, curr) => {
        return prev.plus(curr?.purchased || '0')
      }, new BigNumber(0)).toString()

      setFetchedContract(poolAddress)
      setTotalBought(total)
      setIsFetchedAll(total === poolInfo?.tokenSold)
      setBuyers(rows)
      setLoadingBuyer(false)
    } catch (err) {
      setFetchedContract('')
      setBuyers([])
      setTotalBought('total')
      setIsFetchedAll(false)
      setLoadingBuyer(false)
    }
  }

  const setBuyer = async () => {
    try {
      const poolInstance = await getPoolContract({
        networkAvailable: poolNetwork,
        poolHash: poolAddress,
        isClaimable: true
      })

      let paidTokenAddress = MAPPING_CURRENCY_ADDRESS[poolNetwork]?.[poolDetail?.accept_currency]
      if (!paidTokenAddress) {
        paidTokenAddress = NATIVE_TOKEN_ADDRESS
      }

      const tx = await poolInstance?.methods.setPurchasingState(
        paidTokenAddress,
        buyers.map(user => user.walletAddress),
        buyers.map(user => user.purchased)
      ).send({ from: loginUser.wallet_address })
      if (!tx) {
        console.log('tx failed', tx)
        return
      }

      dispatch(alertSuccess(`Set buyer done`))
      loadPoolInfo(poolAddress, poolNetwork)
    } catch (err) {
      console.log('setBuyer', err)
      dispatch(alertFailure(`Set buyer error`))
    }
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={6} className={classes.exchangeRate}>
          <div className={classes.formControl} style={{marginTop: 0}}>
            <label className={classes.formControlLabel}>Pool Address</label>
            <select
              value={poolAddress}
              onChange={(e: any) => setPoolAddress(e.target.value)}
              className={classes.formControlInput}
            >
              <option value={''} disabled hidden>Please select the pool address</option>
              {
                !!poolDetail?.campaign_hash &&
                <option value={poolDetail?.campaign_hash}>{poolDetail?.campaign_hash} - {poolDetail.network_available}</option>
              }
              {
                !!poolDetail?.campaign_claim_hash &&
                <option value={poolDetail?.campaign_claim_hash}>{poolDetail?.campaign_claim_hash} - {poolDetail.network_claim}</option>
              }
            </select>
          </div>

          {
            loadingInfo &&
            <div className={classes.poolInfo}>
              Loading...
            </div>
          }
          {
          poolInfo && !loadingInfo && (
            <div className={classes.poolInfo}>
              <div className="poolInfoBlock">
                <span className="poolInfoLabel">Token (from contract)</span>
                <div className="poolInfoContent">
                  <p className="poolInfoText wordBreak">{poolInfo?.tokenAddress}</p>
                </div>
              </div>
              <div className="poolInfoBlock">
                <span className="poolInfoLabel">Claimable</span>
                <div className="poolInfoContent">
                <p className="poolInfoText wordBreak">{JSON.stringify(poolInfo?.claimable)}</p>
                </div>
              </div>
              <div className="poolInfoBlock">
                <span className="poolInfoLabel">Token Sold (wei)</span>
                <div className="poolInfoContent">
                  <p className="poolInfoText wordBreak">{poolInfo?.tokenSold}</p>
                </div>
              </div>
              <div className="poolInfoBlock">
                <span className="poolInfoLabel">AllowChangePurchasedState</span>
                <div className="poolInfoContent">
                <p className="poolInfoText wordBreak">{JSON.stringify(poolInfo?.allowChangePurchasedState)}</p>
                </div>
              </div>
            </div>
          )
        }
        </Grid>
        <Grid item xs={6} className={classes.exchangeRate}>
          <div className={classes.formControl} style={{marginTop: 0}}>
            <label className={classes.formControlLabel}>Start Crawl Block {startBlock?.timestamp ? `- ${(new Date(startBlock?.timestamp * 1000)).toString()}` : ''}</label>
            <input
              type="number"
              className={classes.formControlInput}
              value={startBlockNumber}
              onChange={(e: any) => setStartBlockNumber(Number(e.target.value))}
            />
          </div>

          <div className={classes.formControl} style={{marginTop: 0}}>
            <label className={classes.formControlLabel}>End Crawl Time</label>
            <div>
              <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                showTime={{
                  defaultValue: moment("00:00:00", "HH:mm:ss"),
                  format: "HH:mm"
                }}
                value={endTime}
                onSelect={(datetimeSelected: any) => {
                  setEndTime(datetimeSelected);
                }}
                minuteStep={15}
                className={`${commonStyle.DateTimePicker} ${classes.formDatePicker}`}
              />
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={updateEndCrawlBlock}
                style={{ marginLeft: 10, marginTop: 10, marginBottom: 15 }}
              >Update</Button>
            </div>
          </div>

          <div className={classes.formControl} style={{marginTop: 10}}>
            <label className={classes.formControlLabel}>End Crawl Block {endBlock?.timestamp ? `- ${(new Date(endBlock?.timestamp * 1000)).toString()}` : ''}</label>
            <input
              type="number"
              className={classes.formControlInput}
              value={endBlockNumber}
              onChange={(e: any) => setEndBlockNumber(Number(e.target.value))}
            />
          </div>

          <div className={classes.formControl} style={{marginTop: 10}}>
            <label className={classes.formControlLabel}>Step</label>
            <input
              type="number"
              value={step}
              onChange={(e: any) => setStep(Number(e.target.value))}
              className={classes.formControlInput}
            />
          </div>
        </Grid>
      </Grid>

      <div className={commonStyle.boxSearch}>
        {/* <input className={commonStyle.inputSearch} placeholder="Search buyers" /> */}
        {/* <img src="/images/icon-search.svg" alt="" style={{ marginLeft: -30 }} /> */}

        <div style={{float: 'right'}}>
          <Button
            variant="contained"
            color="primary"
            onClick={fetchBuyer}
            disabled={loadingBuyer || !poolInfo || !poolInfo?.tokenSold || poolInfo?.tokenSold === "0"}
            style={{ marginLeft: 10, marginTop: 10, marginBottom: 15 }}
          >{loadingBuyer ? 'Fetching' : 'Fetch'}</Button>
        </div>
        <div style={{float: 'right'}}>
          <Button
            variant="contained"
            color="primary"
            onClick={setBuyer}
            disabled={loadingBuyer || !poolInfo?.allowChangePurchasedState || !buyers || !buyers.length}
            style={{ marginLeft: 10, marginTop: 10, marginBottom: 15 }}
          >{loadingBuyer ? 'Setting Purchased State' : 'Set Purchased State'}</Button>
        </div>
        <div style={{float: 'right'}}>
          <Button
            variant="contained"
            color="primary"
            disabled={!buyers || !buyers.length}
            style={{ marginLeft: 10, marginTop: 10, marginBottom: 15 }}
            >
            <CSVLink style={{ color: 'unset' }} {...csvReport}>Export to CSV</CSVLink>
          </Button>
        </div>
        <div style={{float: 'right'}}>
          <Button
            variant="contained"
            color="primary"
            disabled={!buyers || !buyers.length}
            style={{ marginLeft: 10, marginTop: 10, marginBottom: 15 }}
            >
            <CSVLink style={{ color: 'unset' }} {...csvEventsReport}>Export events to CSV</CSVLink>
          </Button>
        </div>
      </div>

      <TableContainer component={Paper} className={`${commonStyle.tableScroll} ${classesTable.tableUserJoin}`}>
        <Table className={classesTable.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center" size={'medium'}>Wallet Address</TableCell>
              <TableCell align="right">Purchased (wei)</TableCell>
              <TableCell align="right">Purchased Amount</TableCell>
              <TableCell align="right">Claimed (wei)</TableCell>
              <TableCell align="right">Invested (wei)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {buyers.map((row: any, index: number) => (
              <TableRow key={row.walletAddress}>
                <TableCell align="center" size={'medium'}>
                  <Link href={etherscanRoute(row.wallet_address, poolDetail)} target={'_blank'}>
                    {row.walletAddress}
                  </Link>
                </TableCell>

                <TableCell align="right">
                  {row.purchased}
                </TableCell>

                <TableCell align="right">
                  {
                    (tokenInfo?.decimals && row.purchased) ?
                    `${new BigNumber(row.purchased).div(new BigNumber(10).pow(tokenInfo?.decimals)).toFixed(2)} ${tokenInfo?.symbol}` :
                    ''
                  }
                </TableCell>

                <TableCell align="right">
                  {row.claimed}
                </TableCell>

                <TableCell align="right">
                  {row.invested}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      </TableContainer>
      {
        fetchedContract &&
        <div style={{float: 'left', marginTop: 10}}>
          Fetched Contract: {fetchedContract}
        </div>
      }
      {
        new BigNumber(totalBought).isGreaterThan('0') &&
        <div style={{float: 'right', marginTop: 10}}>
          <span>
            Fetched Total: {totalBought} (wei)
            {
              (tokenInfo?.decimals && totalBought ) ?
              ` - ${new BigNumber(totalBought).div(new BigNumber(10).pow(tokenInfo?.decimals)).toFixed(2)} ${tokenInfo?.symbol}` :
              ''
            }
          </span>
          {
            isFetchedAll &&
            <img src="/images/icon_check.svg" alt="" style={{marginLeft: 5}} />
          }
        </div>
      }
    </>
  )
}

export default withRouter(UserReverse)
