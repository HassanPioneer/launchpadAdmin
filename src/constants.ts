export const TRANSACTION_ERROR = "Transaction failed. Please check blockchain to know more error.";
export const DEFAULT_LIMIT = 10;
export const API_URL_PREFIX = "admin";
export const ADMIN_URL_PREFIX = "dashboard";
export const IMAGE_URL_PREFIX = "image";
export const MAX_BUY_CAMPAIGN = 1000;
export const DATETIME_FORMAT = "YYYY-MM-DD HH:mm:ss";
export const TIERS_LABEL = ["-", "Bronze", "Silver", "Gold", "Diamond"];

export const TIERS = {
  DOVE: 1,
  HAWK: 2,
  EAGLE: 3,
  PHOENIX: 4,
};
export const REFUND_TIME_FOR_TIER = {
  [TIERS.DOVE]: 3,
  [TIERS.HAWK]: 5,
  [TIERS.EAGLE]: 12,
  [TIERS.PHOENIX]: 24,
};

export const months = [
  { value: 0, label: "All Month" },
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];
export const ONBOARD_STATUS = {
  ALL: 0,
  SUCCESSFULL: 1,
  PENDING: 2,
};
export const onboardStatus = [
  { value: ONBOARD_STATUS.ALL, label: "All Onboarding Statuses" },
  { value: ONBOARD_STATUS.SUCCESSFULL, label: "Successful" },
  { value: ONBOARD_STATUS.PENDING, label: "Pending" },
];

export const ACCEPT_CURRENCY = {
  ETH: "eth",
  BUSD: "busd",
  USDT: "usdt",
  USDC: "usdc",
};
export const BUY_TYPE = {
  WHITELIST_LOTTERY: "whitelist",
  FCFS: "fcfs",
};
export const POOL_TYPE = {
  SWAP: "swap",
  CLAIMABLE: "claimable",
};
export const TOKEN_TYPE = {
  BEP20: "bep20",
  ERC20: "erc20",
};
export const CLAIM_TYPE = {
  CLAIM_ON_LAUNCHPAD: "claim-on-launchpad",
  AIRDROP_TO_PARTICIPANTS_WALLETS: "airdrop-to-participants-wallet",
  CLAIM_A_PART_OF_TOKENS_ON_LAUNCHPAD: "claim-a-part-of-tokens-on-launchpad",
  CLAIM_ON_THE_PROJECT_WEBSITE: "claim-on-the-project-website",
};
export const NETWORK_AVAILABLE = {
  ETH: "eth",
  BSC: "bsc",
  POLYGON: "polygon",
  AVALANCHE: "avalanche",
  ARBITRUM: "arbitrum"
};
export const PUBLIC_WINNER_STATUS = {
  PUBLIC: 1,
  PRIVATE: 0,
};
export const POOL_IS_PRIVATE = {
  PUBLIC: 0,
  PRIVATE: 1,
  SEED: 2,
  COMMUNITY: 3,
  EVENT: 4,
};
export const PICK_WINNER_RULE = {
  RULE_LUCKY_AND_WEIGHT: "rule-lucky-and-weight",
};

export const USDT_ADDRESS = process.env.REACT_APP_SMART_CONTRACT_ETH_USDT_ADDRESS;
export const USDC_ADDRESS = process.env.REACT_APP_SMART_CONTRACT_ETH_USDC_ADDRESS;

export const USDT_BSC_ADDRESS = process.env.REACT_APP_SMART_CONTRACT_BSC_USDT_ADDRESS;
export const USDC_BSC_ADDRESS = process.env.REACT_APP_SMART_CONTRACT_BSC_USDC_ADDRESS;
export const BUSD_BSC_ADDRESS = process.env.REACT_APP_SMART_CONTRACT_BSC_BUSD_ADDRESS;

export const USDT_POLYGON_ADDRESS = process.env.REACT_APP_SMART_CONTRACT_POLYGON_USDT_ADDRESS;
export const USDC_POLYGON_ADDRESS = process.env.REACT_APP_SMART_CONTRACT_POLYGON_USDC_ADDRESS;

export const USDT_AVALANCHE_ADDRESS = process.env.REACT_APP_SMART_CONTRACT_AVALANCHE_USDT_ADDRESS;

export const USDT_ARBITRUM_ADDRESS = process.env.REACT_APP_SMART_CONTRACT_ARBITRUM_USDT_ADDRESS;

export const ETHERSCAN_URL = process.env.REACT_APP_ETHERSCAN_BASE_URL || "";
export const BCSSCAN_URL = process.env.REACT_APP_BSCSCAN_BASE_URL || "";

export const ETH_CHAIN_ID = process.env.REACT_APP_ETH_NETWORK_ID as string;
export const BSC_CHAIN_ID = process.env.REACT_APP_BSC_NETWORK_ID as string;

export const POLYGON_CHAIN_ID = process.env.REACT_APP_POLYGON_NETWORK_ID as string;
export const AVALANCHE_CHAIN_ID = process.env.REACT_APP_AVALANCHE_NETWORK_ID as string;
export const ARBITRUM_CHAIN_ID = process.env.REACT_APP_ARBITRUM_NETWORK_ID as string;

export const NETWORK_ETH_NAME = process.env.REACT_APP_ETH_NETWORK_NAME;
export const NETWORK_BSC_NAME = process.env.REACT_APP_BSC_NETWORK_NAME;
export const NETWORK_POLYGON_NAME = process.env.REACT_APP_POLYGON_NETWORK_NAME;
export const NATIVE_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000";

export const MAPPING_CHAINNAME_CHAINID: any = {
  [NETWORK_AVAILABLE.ETH]: ETH_CHAIN_ID,
  [NETWORK_AVAILABLE.BSC]: BSC_CHAIN_ID,
  [NETWORK_AVAILABLE.POLYGON]: POLYGON_CHAIN_ID,
  [NETWORK_AVAILABLE.AVALANCHE]: AVALANCHE_CHAIN_ID,
  [NETWORK_AVAILABLE.ARBITRUM]: ARBITRUM_CHAIN_ID,
};

export const MAPPING_CURRENCY_ADDRESS: any = {
  eth: {
    eth: NATIVE_TOKEN_ADDRESS,
    native: NATIVE_TOKEN_ADDRESS,
    usdt: USDT_ADDRESS,
    usdc: USDC_ADDRESS,
  },
  bsc: {
    eth: NATIVE_TOKEN_ADDRESS, // eth for native token
    native: NATIVE_TOKEN_ADDRESS,
    busd: BUSD_BSC_ADDRESS,
    usdt: USDT_BSC_ADDRESS,
    usdc: USDC_BSC_ADDRESS,
  },
  polygon: {
    eth: NATIVE_TOKEN_ADDRESS, // eth for native token
    native: NATIVE_TOKEN_ADDRESS,
    usdt: USDT_POLYGON_ADDRESS,
    usdc: USDC_POLYGON_ADDRESS,
  },
  avalanche: {
    eth: NATIVE_TOKEN_ADDRESS, // eth for native token
    native: NATIVE_TOKEN_ADDRESS,
    usdt: USDT_AVALANCHE_ADDRESS,
  },
  arbitrum: {
    eth: NATIVE_TOKEN_ADDRESS, // eth for native token
    native: NATIVE_TOKEN_ADDRESS,
    usdt: USDT_ARBITRUM_ADDRESS,
  },
};

export const APP_NETWORK_NAMES = {
  [ETH_CHAIN_ID]: NETWORK_ETH_NAME,
  [BSC_CHAIN_ID]: NETWORK_BSC_NAME,
};
export const ACCEPT_NETWORKS = {
  ETH_CHAIN_ID: process.env.REACT_APP_ETH_NETWORK_ID,
  BSC_CHAIN_ID: process.env.REACT_APP_BSC_NETWORK_ID,
  POLYGON_CHAIN_ID: process.env.REACT_APP_POLYGON_NETWORK_ID,
  AVALANCHE_CHAIN_ID: process.env.REACT_APP_AVALANCHE_NETWORK_ID,
  ARBITRUM_CHAIN_ID: process.env.REACT_APP_ARBITRUM_NETWORK_ID,
};

export const CHAIN_IDS = {
  MAINNET: 1,
  ROPSTEN: 3,
  RINKEBY: 4,
  GOERLI: 5,
  KOVAN: 42,
  BSC_TESTNET: 97,
  BSC_MAINNET: 56,
  POLYGON_TESTNET: 80001,
  POLYGON: 137,
  ARBITRUM: 42161,
  ARBITRUM_TESTNET: 421613
};
export const CHAIN_ID_NAME_MAPPING: any = {
  "1": "Mainnet",
  "3": "Ropsten",
  "4": "Rinkeby",
  "5": "Goerli",
  "42": "Kovan",
  "97": "BSC Testnet",
  "56": "BSC Mainnet",
  "137": "Polygon Mainnet",
  "80001": "Polygon Testnet",
  "43114": "Avalanche Network",
  "43113": "Avalanche FUJI C-Chain",
  "42161": "Arbitrum Mainnet",
  "421613": "Arbitrum Goerli Testnet",
};
export const ETH_NETWORK_ACCEPT_CHAINS: any = {
  "1": "Mainnet",
  "3": "Ropsten",
  "4": "Rinkeby",
  "5": "Goerli",
  "42": "Kovan",
};
export const BSC_NETWORK_ACCEPT_CHAINS: any = {
  "97": "BSC Testnet",
  "56": "BSC Mainnet",
};

export const POLYGON_NETWORK_ACCEPT_CHAINS: any = {
  "80001": "Polygon Testnet",
  "137": "Polygon Mainnet",
};

export const AVALANCE_NETWORK_ACCEPT_CHAINS: any = {
  "43114": "Avalanche Network",
  "43113": "Avalanche FUJI C-Chain",
};
export const ARBITRUM_NETWORK_ACCEPT_CHAINS: any = {
  "42161": "Arbitrum Mainnet",
  "421613": "Arbitrum Goerli Testnet",
};

export const ETHERSCAN_BASE_URL: any = {
  "1": "https://etherscan.io/address",
  "4": "https://rinkeby.etherscan.io/address",
  "5": "https://goerli.etherscan.io/address",
  "56": "https://bscscan.com/address",
  "97": "https://testnet.bscscan.com/address",
  "137": "https://polygonscan.com/address/",
  "80001": "https://mumbai.polygonscan.com/address/",
  "42161": "https://arbiscan.io/address/",
  "421613": "https://goerli.arbiscan.io/address/",
};

export const EXPORT_USER_TYPE: any = {
  USER_LIST: "USER_LIST",
  USER_PARTICIPANT: "USER_PARTICIPANT",
  USER_WINNER: "USER_WINNER",
};
