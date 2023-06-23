import React from 'react';
import useStyles from './styles';
import {useSelector} from "react-redux";
import {
  ACCEPT_NETWORKS,
  CHAIN_ID_NAME_MAPPING,
} from "../../../constants";

const NetworkWarningBanner: React.FC<any> = (props: any) => {
  const styles = useStyles();
  const { userCurrentNetwork } = useSelector((state: any) => state);
  const currentNetworkId = userCurrentNetwork?.currentNetworkId;

  if (currentNetworkId === '') return null;
  if (Object.values(ACCEPT_NETWORKS).includes(currentNetworkId)) {
    return null;
  }

  return (
    <>
      <div className={styles.loginErrorBanner}>
        <img src="/images/red-warning.svg" alt="red-warning icon" />
        <span className={styles.loginErrorBannerText}>
          Please change to correct network
          {' '}
          Current Network: {CHAIN_ID_NAME_MAPPING[currentNetworkId]} ({currentNetworkId})
        </span>
      </div>
    </>
  );
};

export default NetworkWarningBanner;
