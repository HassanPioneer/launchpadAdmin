import Web3 from 'web3';
import {NETWORK_AVAILABLE} from "../constants";

const POOL_ABI = require('../abi/Swap/Campaign.json');
const POOL_PRESALE_ABI = require('../abi/Claim/Campaign.json');
const ERC20_ABI = require('../abi/Erc20.json');

const ETH_NETWORK_URL = process.env.REACT_APP_ETH_RPC_URL || "";
const BSC_NETWORK_URL = process.env.REACT_APP_BSC_RPC_URL || "";
const POLYGON_NETWORK_URL = process.env.REACT_APP_POLYGON_RPC_URL || "";
const AVALANCHE_NETWORK_URL = process.env.REACT_APP_AVALANCHE_RPC_URL || "";
const ARBITRUM_NETWORK_URL = process.env.REACT_APP_ARBITRUM_RPC_URL || "";

export const getWeb3Instance = () => {
  const windowObj = window as any;
  const { ethereum, web3 } = windowObj;
  if (ethereum && ethereum.isMetaMask) {
    return new Web3(ethereum);
  }
  if (web3) {
    return new Web3(web3.currentProvider);
  }
  return null;
};

export const isMetaMaskInstalled = () => {
  const windowObj = window as any;
  const { ethereum } = windowObj;
  return ethereum && ethereum.isMetaMask;
};

export const getContractInstance = (ABIContract: any, contractAddress: string, isEth: boolean = true) => {
  if (isEth) {
    return getContractInstanceWithEthereum(ABIContract, contractAddress);
  } else {
    return getContractInstanceWithBSC(ABIContract, contractAddress);
  }
};

export const getContractReadInstance = (ABIContract: any, contractAddress: string, networkAvailable : string ) => {
  let provider;
  switch (networkAvailable) {
    case NETWORK_AVAILABLE.BSC:
      provider = new Web3.providers.HttpProvider(BSC_NETWORK_URL);
      break;

    case NETWORK_AVAILABLE.POLYGON:
      provider = new Web3.providers.HttpProvider(POLYGON_NETWORK_URL);
      break;

    case NETWORK_AVAILABLE.ETH:
      provider = new Web3.providers.HttpProvider(ETH_NETWORK_URL);
      break;

    case NETWORK_AVAILABLE.AVALANCHE:
      provider = new Web3.providers.HttpProvider(AVALANCHE_NETWORK_URL);
      break;

    case NETWORK_AVAILABLE.ARBITRUM:
      provider = new Web3.providers.HttpProvider(ARBITRUM_NETWORK_URL);
      break;
  }
  if (!provider) {
    return
  }

  const web3Instance = new Web3(provider);

  return new web3Instance.eth.Contract(
    ABIContract,
    contractAddress,
  );
};

export const getContractInstanceWithEthereum = (ABIContract: any, contractAddress: string) => {
  const windowObj = window as any;
  const { ethereum } = windowObj;
  if (ethereum && ethereum.isMetaMask) {
    const web3Instance = new Web3(ethereum);
    return new web3Instance.eth.Contract(ABIContract, contractAddress);
  } else if (windowObj.web3) {
    const web3Instance = new Web3(windowObj.web3.currentProvider);
    return new web3Instance.eth.Contract(ABIContract, contractAddress);
  } else {
    return null;
  }
};

export const getContractInstanceWithBSC = (ABIContract: any, contractAddress: string) => {
  const windowObj = window as any;
  const { ethereum } = windowObj;
  const web3Instance = new Web3(ethereum);
  return new web3Instance.eth.Contract(ABIContract, contractAddress);
};

export const getAbiPool = (isClaimable = true) => {
  const ABI = isClaimable ? POOL_PRESALE_ABI : POOL_ABI;
  return ABI;
}

export const getContractInstanceWeb3 = (isEth = true) => {
  let provider = new Web3.providers.HttpProvider(ETH_NETWORK_URL);
  if (!isEth) {
    provider = new Web3.providers.HttpProvider(BSC_NETWORK_URL);
  }
  let web3Instance = new Web3(provider);
  return web3Instance;
};

export const getPoolContract = ({ networkAvailable, poolHash, isClaimable = true }: any) => {
  const ABI = isClaimable ? POOL_PRESALE_ABI : POOL_ABI
  if (networkAvailable == NETWORK_AVAILABLE.ETH) {
    return getContractInstance(ABI, poolHash, true)
  }

  return getContractInstance(ABI, poolHash, false)
}

export const getReadOnlyPoolContract = ({ networkAvailable, poolHash, isClaimable = true }: any) => {
  const ABI = isClaimable ? POOL_PRESALE_ABI : POOL_ABI;

  return getContractReadInstance(ABI, poolHash, networkAvailable);;
};

export const getReadOnlyTokenContract = ({ networkAvailable, tokenAddress }: any) => {
  return getContractReadInstance(ERC20_ABI, tokenAddress, networkAvailable);;
};

export const getErc20Contract = ({ networkAvailable, erc20TokenAddress }: any) => {
  let web3Instance = null;
  switch (networkAvailable) {
    case NETWORK_AVAILABLE.BSC:
      web3Instance = getContractInstance(ERC20_ABI, erc20TokenAddress, false);
      break
    case NETWORK_AVAILABLE.POLYGON:
      web3Instance = getContractInstance(ERC20_ABI, erc20TokenAddress, false);
      break
    case NETWORK_AVAILABLE.AVALANCHE:
      web3Instance = getContractInstance(ERC20_ABI, erc20TokenAddress, false);
      break
    case NETWORK_AVAILABLE.ARBITRUM:
      web3Instance = getContractInstance(ERC20_ABI, erc20TokenAddress, false);
      break
    default:
      web3Instance = getContractInstance(ERC20_ABI, erc20TokenAddress, true);
  }

  return web3Instance;
};

export const convertFromWei = (value: any, unit = 'ether') => {
  const webInstance = getWeb3Instance();
  // @ts-ignore
  return webInstance.utils.fromWei(value, unit);
};

export const convertToWei = (value: any, unit = 'ether') => {
  const webInstance = getWeb3Instance();
  // @ts-ignore
  return webInstance.utils.toWei(value, unit);
};

export const isValidAddress = (address: string) => {
  return Web3.utils.isAddress(address);
}

export const getETHBalance = async (loginUser: string) => {
  const web3 = getWeb3Instance() as any;
  if (web3) {
    const balance = await web3.eth.getBalance(loginUser);

    return web3.utils.fromWei(balance);
  };

  return 0;
}

export const callMultiGetTier = async () => {


}

export const getBlockByTime = async (networkAvailable: string, targetTimestamp: number) => {
  // target timestamp or last midnight
  if (!targetTimestamp) {
    return {number: 0}
  }

  let web3ProviderUrl = ''

  // decreasing average block size will decrease precision and also
  // decrease the amount of requests made in order to find the closest
  // block
  let averageBlockTime = 10

  switch (networkAvailable) {
    case NETWORK_AVAILABLE.BSC:
      web3ProviderUrl = BSC_NETWORK_URL
      averageBlockTime = 3
      break

    case NETWORK_AVAILABLE.POLYGON:
      web3ProviderUrl = POLYGON_NETWORK_URL
      averageBlockTime = 10
      break

    case NETWORK_AVAILABLE.ETH:
      web3ProviderUrl = ETH_NETWORK_URL
      averageBlockTime = 10
      break

    case NETWORK_AVAILABLE.AVALANCHE:
      web3ProviderUrl = AVALANCHE_NETWORK_URL
      averageBlockTime = 3
      break

    case NETWORK_AVAILABLE.ARBITRUM:
      web3ProviderUrl = ARBITRUM_NETWORK_URL
      averageBlockTime = 1
      break
  }

  if (!web3ProviderUrl) {
    return {number: 0}
  }

  const web3 = new Web3(web3ProviderUrl)

  // get current block number
  const latestBlockNumber = await web3.eth.getBlockNumber()
  let block = await web3.eth.getBlock(latestBlockNumber)

  let requestsMade = 0

  let blockNumber = latestBlockNumber
  let lastBlockNumber = 0
  let checked : { [key: string]: boolean} = {};

  if (Number(block.timestamp) < targetTimestamp) {
    console.log('targetTimestamp', targetTimestamp)
    return block
  }

  let decreaseBlocks = Math.floor((Number(block.timestamp) - targetTimestamp) / averageBlockTime)

  if (decreaseBlocks < 1) {
    return block
  }

  lastBlockNumber = blockNumber
  blockNumber -= decreaseBlocks

  block = await web3.eth.getBlock(blockNumber)
  requestsMade += 1

  while (Math.abs(Number(block.timestamp) - targetTimestamp) > averageBlockTime) {
    if (checked[`${blockNumber}`]) {
      break
    }

    checked[`${blockNumber}`] = true

    if (Number(block.timestamp) > targetTimestamp) {
      // let decreaseBlocks = Math.floor(Math.abs(blockNumber - lastBlockNumber) / 2)
      let decreaseBlocks = Math.floor(Math.abs(Number(block.timestamp) - targetTimestamp) / averageBlockTime)

      if (decreaseBlocks < 1) {
        break
      }

      lastBlockNumber = blockNumber
      blockNumber -= decreaseBlocks

      block = await web3.eth.getBlock(blockNumber)
      requestsMade += 1
      continue
    }

    if (Number(block.timestamp) < targetTimestamp) {
      // let increaseBlocks = Math.floor(Math.abs(blockNumber - lastBlockNumber) / 2)
      let increaseBlocks = Math.floor(Math.abs(Number(block.timestamp) - targetTimestamp) / averageBlockTime)

      if (increaseBlocks < 1) {
        break
      }

      lastBlockNumber = blockNumber
      blockNumber += increaseBlocks

      block = await web3.eth.getBlock(blockNumber)

      requestsMade += 1
      continue
    }
  }

  // console.log("tgt timestamp   ->", targetTimestamp)
  // console.log("block timestamp ->", block.timestamp)
  // console.log("requests made   ->", requestsMade)

  return block
}

export const getBlockByNumber = async (blockNumber: number, networkAvailable: string) => {
  let web3ProviderUrl = ''
  switch (networkAvailable) {
    case NETWORK_AVAILABLE.BSC:
      web3ProviderUrl = BSC_NETWORK_URL
      break

    case NETWORK_AVAILABLE.POLYGON:
      web3ProviderUrl = POLYGON_NETWORK_URL
      break

    case NETWORK_AVAILABLE.ETH:
      web3ProviderUrl = ETH_NETWORK_URL
      break
  }

  if (!web3ProviderUrl) {
    return null
  }
  const web3 = new Web3(web3ProviderUrl)

  const latestBlockNumber = await web3.eth.getBlockNumber()
  if (latestBlockNumber < blockNumber) {
    return null
  }

  return await web3.eth.getBlock(blockNumber)
}
