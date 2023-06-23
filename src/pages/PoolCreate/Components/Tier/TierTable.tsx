import React, { useEffect, useState } from "react";
import useStyles from "../../style";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Button, makeStyles } from "@material-ui/core";
import CreateEditTierForm from "./CreateEditTierForm";
import { TIERS_LABEL } from "../../../../constants";
import { renderErrorCreatePool } from "../../../../utils/validate";
import BigNumber from "bignumber.js";
import { getIconCurrencyUsdt } from "../../../../utils/usdt";

const useStylesTable = makeStyles({
  table: {
    minWidth: 650,
  },
});

const createData = (
  name: string,
  minBuy: number,
  maxBuy: number,
  isEdit: boolean,
  ticket_allow_percent = 0,
  ticket_allow = 0
) => {
  return { name, minBuy, maxBuy, isEdit, ticket_allow_percent, ticket_allow };
};

const createDefaultTiers = () => {
  return [
    createData("-", 0, 0, false),
    createData("Bronze", 0, 0, false),
    createData("Silver", 0, 0, false),
    createData("Gold", 0, 0, false),
    createData("Diamond", 0, 0, false),
  ];
};

function TierTable(props: any) {
  const classes = useStyles();
  const classesTable = useStylesTable();
  const { register, watch, poolDetail } = props;
  const renderError = renderErrorCreatePool;
  const [isOpenEditPopup, setIsOpenEditPopup] = useState(false);
  const [editData, setEditData] = useState({});
  const [editRow, setEditRow] = useState(0);
  const [isEdit, setIsEdit] = useState(true);

  const [rows, setRows] = useState(createDefaultTiers());

  useEffect(() => {
    if (poolDetail && poolDetail.tiers) {
      const dataFormatted = poolDetail.tiers.map((item: any, index: any) => {
        return createData(
          TIERS_LABEL[index],
          new BigNumber(item.min_buy).toNumber(),
          new BigNumber(item.max_buy).toNumber(),
          false,
          item.ticket_allow_percent || 0,
          item.ticket_allow || 0
        );
      });

      setRows(dataFormatted);
    }
  }, [poolDetail]);

  const openPopupEdit = (e: any, row: any, index: number) => {
    console.log("ROW: ", row, index);

    setEditData(row);
    setEditRow(index);
    setIsEdit(true);
    setIsOpenEditPopup(true);
  };

  const handleCreateUpdateData = (responseData: any) => {
    console.log("responseData", editRow, responseData);
    if (isEdit && editRow !== -1) {
      // Update
      // @ts-ignore
      rows[editRow] = responseData;
    } else {
      // Create
      // @ts-ignore
      rows.push(responseData);
    }
    setIsOpenEditPopup(false);
  };

  const isDeployed = !!poolDetail?.is_deploy;
  const acceptCurrency = watch("acceptCurrency");
  const minTier = watch("minTier");
  const networkAvailable = watch("networkAvailable");

  let { currencyIcon, currencyName } = getIconCurrencyUsdt({
    purchasableCurrency: acceptCurrency,
    networkAvailable: networkAvailable,
  });

  return (
    <>
      {isOpenEditPopup && (
        <CreateEditTierForm
          isOpenEditPopup={isOpenEditPopup}
          setIsOpenEditPopup={setIsOpenEditPopup}
          renderError={renderError}
          editData={editData}
          isEdit={isEdit}
          handleCreateUpdateData={handleCreateUpdateData}
        />
      )}

      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Tier Configuration - <i>This table will be updated after picking winner</i></label>
      </div>
      <TableContainer component={Paper}>
        <Table className={classesTable.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Allocation (%)</TableCell>
              <TableCell align="right">Ticket Number</TableCell>
              <TableCell align="right">Ticket Value</TableCell>
              <TableCell align="right">Currency</TableCell>
              {/* <TableCell align="right">Actions</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: any, index: number) => {
              let minBuy = new BigNumber(row.minBuy || "0").toFixed();
              let maxBuy = new BigNumber(row.maxBuy || "0").toFixed();

              return (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.ticket_allow_percent || 0}</TableCell>
                  <TableCell align="right">{row.ticket_allow || 0}</TableCell>
                  <TableCell align="right">{maxBuy}</TableCell>
                  <TableCell align="right">{currencyName}</TableCell>
                  {/* <TableCell align="right">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={(e) => openPopupEdit(e, row, index)}
                      disabled={isDeployed || index < minTier}
                    >
                      Edit
                    </Button>
                  </TableCell> */}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <input
        type="hidden"
        name="tierConfiguration"
        value={JSON.stringify(rows)}
        ref={register({
          // required: true
        })}
      />
    </>
  );
}

export default TierTable;
