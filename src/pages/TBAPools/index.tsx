import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Pagination from "@material-ui/lab/Pagination";
import Skeleton from "@material-ui/lab/Skeleton";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ButtonLink from "../../components/Base/ButtonLink";
import Transition from "../../components/Base/Transition";
import DefaultLayout from "../../components/Layout/DefaultLayout";
import { deleteTBAPool } from "../../request/pool";
import { alertFailure, alertSuccess } from "../../store/actions/alert";
import { getTBACampaigns } from "../../store/actions/campaign";
import { useCommonStyle } from "../../styles";
import { adminRoute } from "../../utils";
import PoolRecord from "./PoolsRecord";
import useStyles from "./style";

const tableHeaders = ["POOL NAME", "POOL TYPE", "NETWORK", "DISPLAY"];

const TBAPools: React.FC<any> = (props: any) => {
  const classes = useStyles();
  const commonStyle = useCommonStyle();

  const dispatch = useDispatch();

  const {
    page = 1,
    lastPage,
    data: campaigns,
  } = useSelector((state: any) => state.tbaCampaigns.data);
  const { loading, failure } = useSelector((state: any) => state.tbaCampaigns);

  const [currentPage, setCurrentPage] = useState(page);
  const [idDelete, setIdDelete] = useState<string>("");
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);

  useEffect(() => {
    handleCampaignQuery(currentPage);
  }, [dispatch, currentPage]);

  const handlePaginationChange = (event: any, page: number) => {
    setCurrentPage(page);
  };

  const handleCampaignQuery = (currentPage: number) => {
    dispatch(getTBACampaigns(currentPage));
  };

  const confirmDelete = (id: string = "") => {
    setShowConfirmDelete(true);
    setIdDelete(id);
  };

  const onConfirmDelete = async () => {
    setDeleteLoading(true);
    const response = await deleteTBAPool(idDelete);
    if (response?.status === 200) {
      dispatch(alertSuccess("Successful!"));
      window.location.reload();
    } else {
      dispatch(alertFailure("Fail!"));
    }
    setDeleteLoading(false);
    setShowConfirmDelete(false)
  };

  return (
    <DefaultLayout>
      <div className={classes.header}>
        <div className="header-left">
          <ButtonLink
            to={adminRoute("/tba-campaigns/add")}
            text={"Create New TBA Pool"}
            icon={"icon_plus.svg"}
          />
        </div>
      </div>

      <TableContainer component={Paper} className={classes.tableContainer}>
        {loading ? (
          [...Array(10)].map((num, index) => (
            <div key={index}>
              <Skeleton className={classes.skeleton} width={"100%"} />
            </div>
          ))
        ) : (
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {tableHeaders.map((tableHeader: string, index: number) => (
                  <TableCell key={index} className={classes.tableHeader}>
                    {tableHeader}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody className={classes.tableBody}>
              {campaigns &&
                campaigns.length > 0 &&
                campaigns.map((campaign: any, index: number) => (
                  <PoolRecord
                    key={campaign.id}
                    campaign={campaign}
                    confirmDelete={confirmDelete}
                  />
                ))}
            </TableBody>
          </Table>
        )}
        {failure ? (
          <p className={classes.errorMessage}>{failure}</p>
        ) : (!campaigns || campaigns.length === 0) && !loading ? (
          <p className={classes.noDataMessage}>There is no data</p>
        ) : (
          <>
            {campaigns && lastPage > 1 && (
              <Pagination
                page={currentPage}
                className={classes.pagination}
                count={lastPage}
                onChange={handlePaginationChange}
              />
            )}
          </>
        )}
      </TableContainer>

      <Dialog
        open={showConfirmDelete}
        TransitionComponent={Transition}
        aria-labelledby="form-dialog-title"
        className={classes.dialog}
      >
        <DialogTitle id="form-dialog-title">Delete</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          Are you sure to Delete?
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button
            className={classes.dialogButton}
            disabled={deleteLoading}
            onClick={onConfirmDelete}
            color="primary"
          >
            Submit
            {deleteLoading && (
              <CircularProgress size={25} style={{ marginLeft: 10 }} />
            )}
          </Button>
          <Button
            disabled={deleteLoading}
            className={`${classes.dialogButton} ${classes.dialogButtonCancel}`}
            onClick={() => setShowConfirmDelete(false)}
            color="primary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </DefaultLayout>
  );
};

export default TBAPools;
