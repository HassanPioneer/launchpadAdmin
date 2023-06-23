import React from 'react';
import NavLeft from './NavLeft';
import Button from '@material-ui/core/Button';
import useStyles from './styles';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { Link } from 'react-router-dom';
import {adminRoute} from "../../../utils";

const LeftDefaultLayout = (props: any) => {
  const styles = useStyles();
  const [smallLeft, setSmallLeft] = React.useState(false);
  const { data: loginUser } = useTypedSelector(state => state.user);

  return (
    <div className={styles.leftLayout + ' ' + (smallLeft && styles.smallLeft)}>
      <div className={styles.headLeft}>
        <div className={styles.BoxInfoUser}>
          <Link to={adminRoute('/profile')}>
            <img className={styles.avatar} src="/images/avatar.svg" alt="" />
          </Link>
          {
            !smallLeft &&
            <div className={styles.infoUser}>
              <div className="name">{loginUser?.username}</div>
            </div>
          }
        </div>
        <Button className={styles.btnSmallBig + ' ' + (smallLeft && 'btnSmall')} onClick={() => setSmallLeft(!smallLeft)}></Button>
      </div>
      <NavLeft smallLeft={smallLeft}/>
    </div>
  );
};

export default LeftDefaultLayout;
