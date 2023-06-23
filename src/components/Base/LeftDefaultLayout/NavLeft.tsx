import React from "react";
import { Link, withRouter } from "react-router-dom";
import useStyles from "./styles";
import { adminRoute } from "../../../utils";
import { logout } from "../../../store/actions/user";
import { useDispatch } from "react-redux";

const nav = [
  {
    title: "List Pool",
    part: adminRoute("/campaigns"),
    icon: "icon-list-campaign",
  },
  // {
  //   title: "List TBA Pool",
  //   part: adminRoute("/tba-campaigns"),
  //   icon: "icon-list-campaign",
  // },
  {
    title: "List User",
    part: adminRoute("/users"),
    icon: "icon-users",
  },
  // {
  //   title: "User Referral",
  //   part: adminRoute("/referrals"),
  //   icon: "icon-history",
  // },
  {
    title: "KYC User List",
    part: adminRoute("/kyc-users"),
    icon: "icon-users",
  },
  {
    title: "Staking Pools",
    part: adminRoute("/staking"),
    icon: "icon-list-campaign",
  },
  {
    title: "List Admin",
    part: adminRoute("/admins"),
    icon: "icon-users",
  },
  {
    title: "Statistic",
    part: adminRoute("/statistic"),
    icon: "icon-setting",
  },
];

const NavLeft = (props: any) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const { smallLeft, location } = props;
  const [navLeft] = React.useState(nav);

  const logoutUser = () => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm("Do you want logout?")) {
      return false;
    }
    dispatch(logout());
  };

  return (
    <ul className={styles.navLeft}>
      {navLeft.map((item, index) => {
        return (
          <li
            key={index}
            className={
              styles.itemNavLeft +
              " " +
              (location?.pathname === item.part && "active")
            }
          >
            <Link
              to={item.part}
              className={
                styles.linkItemNavLeft +
                " " +
                (location?.pathname === item.part && "active")
              }
            >
              <i
                className={(smallLeft && " icon-small") + " icon " + item.icon}
              ></i>
              {!smallLeft && item.title}
            </Link>
          </li>
        );
      })}

      <li className={styles.itemNavLeft}>
        <a onClick={logoutUser} className={styles.linkItemNavLeft}>
          <i
            className={(smallLeft && " icon-small") + " icon icon-setting"}
          ></i>
          {!smallLeft && "Logout"}
        </a>
      </li>
    </ul>
  );
};

export default withRouter(NavLeft);
