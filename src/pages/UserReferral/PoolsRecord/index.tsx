import { TableCell, TableRow, Tooltip } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { POOL_IS_PRIVATE } from "../../../constants";
import useComponentVisible from "../../../hooks/useComponentVisible";
import { adminRoute } from "../../../utils";
import useStyles from "./style";

type PoolProps = {
  id: string;
  title: string;
  is_private: string;
  is_display: string;
  network_available: string;
};

type PoolRecordProps = {
  campaign: PoolProps;
  confirmDelete: (id: string) => void;
};

const PoolRecord: React.FC<PoolRecordProps> = (
  props: PoolRecordProps
) => {
  const { campaign, confirmDelete } = props;
  const classes = useStyles();

  const { ref } = useComponentVisible();

  const getPoolPrivateText = (is_private: string) => {
    switch (Number(is_private)) {
      case POOL_IS_PRIVATE.COMMUNITY:
        return "Community";
      case POOL_IS_PRIVATE.PRIVATE:
        return "Private";
      case POOL_IS_PRIVATE.PUBLIC:
        return "Public";
      case POOL_IS_PRIVATE.SEED:
        return "Seed";
      default:
        break;
    }
    return "";
  };

  const handleDelete = (e: any) => {
    e.preventDefault();
    confirmDelete(campaign.id);
  };

  return (
    <TableRow
      ref={ref}
      className={classes.tableRow}
      key={campaign.id}
      component={Link}
      to={adminRoute(`/tba-campaign-detail/${campaign.id}`)}
    >
      <TableCell className={classes.tableCellTitle} component="td" scope="row">
        <Tooltip title={<p style={{ fontSize: 15 }}>{campaign.title}</p>}>
          <span className={classes.wordBreak}>{campaign.title}</span>
        </Tooltip>
      </TableCell>
      <TableCell className={classes.tableCellTitle} component="td" scope="row">
        {getPoolPrivateText(campaign.is_private)}
      </TableCell>
      <TableCell className={classes.tableCellTitle} component="td" scope="row">
        {campaign.network_available.toUpperCase()}
      </TableCell>

      <TableCell className={classes.tableCell} align="left">
        <div className={classes.tableCellFlex}>
          <div className="left">
            <span
              className={`campaign-status campaign-${
                !!+campaign.is_display ? "active" : "paused"
              }`}
            ></span>
            {!!+campaign.is_display ? "Active" : "None"}
          </div>
          <div className="right">
            <img
              src="/images/icon-delete.svg"
              alt=""
              className={classes.deleteIcon}
              onClick={handleDelete}
            />
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default PoolRecord;
