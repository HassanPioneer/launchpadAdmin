import { Button, makeStyles } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import BigNumber from "bignumber.js";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { CLAIM_TYPE, DATETIME_FORMAT } from "../../../../constants";
import { convertMomentObjectToDateTimeString } from "../../../../utils/convertDate";
import { renderErrorCreatePool } from "../../../../utils/validate";
import useStyles from "../../style";
import ClaimGuide from "./ClaimGuide";
import ClaimPolicy from "./ClaimPolicy";
import ClaimType from "./ClaimType";
import CreateEditClaimConfigForm from "./CreateEditClaimConfigForm";
import FirstTimeClaimPhase from "./FirstTimeClaimPhase";
import RemainingTokens from "./RemainingTokens";
import RepeatClaimConfigForm from "./RepeatClaimConfigForm";

const useStylesTable = makeStyles({
  table: {
    minWidth: 650,
  },
});

const createData = (
  id: number,
  startTime: any,
  endTime: any,
  minBuy: number,
  maxBuy: number,
  isEdit: boolean
) => {
  return { id, startTime, endTime, minBuy, maxBuy, isEdit };
};

const createDefaultTiers = () => {
  return [
    // createData('-', null, null, 0, 1000, false),
    // createData('Dove', moment().format(DATETIME_FORMAT), moment().add(1, 'd').format(DATETIME_FORMAT), 0, 2000, false),
    // createData('Hawk', moment().format(DATETIME_FORMAT), moment().add(1, 'd').format(DATETIME_FORMAT), 0, 3000, false),
    // createData('Eagle', moment().format(DATETIME_FORMAT), moment().add(1, 'd').format(DATETIME_FORMAT), 0, 4000, false),
    // createData('Phoenix', moment().format(DATETIME_FORMAT), moment().add(1, 'd').format(DATETIME_FORMAT), 0, 5000, false),
  ];
};
type RepeatDataProps = {
  fromDate: string;
  toDate: string;
  repeatEvery: number;
  initialValue: number;
  repeatValue: number;
  repeatType: string;
};

function ClaimConfigTable(props: any) {
  const classes = useStyles();
  const classesTable = useStylesTable();
  const { register, watch, setValue, control, errors, poolDetail } = props;
  const renderError = renderErrorCreatePool;
  const [isOpenEditPopup, setIsOpenEditPopup] = useState(false);
  const [isOpenRepeatPopup, setIsOpenRepeatPopup] = useState(false);
  const [editData, setEditData] = useState({});
  const [editRow, setEditRow] = useState(0);
  const [isEdit, setIsEdit] = useState(true);
  const [rows, setRows] = useState(createDefaultTiers());

  useEffect(() => {
    if (poolDetail && poolDetail.campaignClaimConfig) {
      console.log(
        "poolDetail.campaignClaimConfig-->item",
        poolDetail.campaignClaimConfig
      );
      const dataFormatted = poolDetail.campaignClaimConfig.map(
        (item: any, index: any) => {
          return createData(
            index + 1,
            item.start_time
              ? moment(item.start_time * 1000).format(DATETIME_FORMAT)
              : null,
            item.end_time
              ? moment(item.end_time * 1000).format(DATETIME_FORMAT)
              : null,
            new BigNumber(item.min_percent_claim).toNumber(),
            new BigNumber(item.max_percent_claim).toNumber(),
            false
          );
        }
      );
      console.log("dataFormatted-->item", dataFormatted);

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

  const openPopupCreate = (e: any) => {
    setEditData({});
    setEditRow(-1);
    setIsEdit(false);
    setIsOpenEditPopup(true);
  };

  const handleCreateUpdateData = (responseData: any) => {
    // console.log("responseData", editRow, responseData);
    if (isEdit && editRow !== -1) {
      // Update
      // @ts-ignore
      rows[editRow] = responseData;
    } else {
      // Create
      // @ts-ignore
      rows.push(responseData);
    }
    setValue("campaignClaimConfig", JSON.stringify(rows));
    setIsOpenEditPopup(false);
  };

  const openPopupRepeat = (e: any) => {
    setIsOpenRepeatPopup(true);
  };

  const handleCreateRepeatData = (repeatData: RepeatDataProps) => {
    // console.log("handleCreateRepeatData", repeatData);
    let fromDate = new Date(repeatData.fromDate);
    let toDate = new Date(repeatData.toDate);

    let numberDiff = 0;
    let keyDateShort: any = "M";
    switch (repeatData.repeatType) {
      case "day":
        numberDiff = moment(toDate).diff(moment(fromDate), "days");
        keyDateShort = "d";
        break;
      case "week":
        numberDiff = moment(toDate).diff(moment(fromDate), "weeks");
        keyDateShort = "w";
        break;
      case "month":
        numberDiff = moment(toDate).diff(moment(fromDate), "months");
        keyDateShort = "M";
        break;
      default:
        keyDateShort = "M";
        break;
    }

    if (numberDiff < 1) {
      return alert(
        `To Date must be greater than From Date at least 1 ${repeatData.repeatType}!`
      );
    }
    let newRows = [...rows];
    let maxIndex = Math.floor(numberDiff / repeatData.repeatEvery);
    for (let index = 0; index <= maxIndex; index++) {
      let newRow: any = {
        startTime: convertMomentObjectToDateTimeString(
          moment(repeatData.fromDate).add(
            index * repeatData.repeatEvery,
            keyDateShort
          )
        ),
        maxBuy:
          new BigNumber(repeatData.initialValue)
            .plus(new BigNumber(index).multipliedBy(repeatData.repeatValue))
            .toNumber() + "",
      };
      // @ts-ignore
      newRows.push(newRow);
    }

    // order by startTime
    newRows = orderByDatetime(newRows);

    console.log(newRows);
    setValue("campaignClaimConfig", JSON.stringify(newRows));
    setRows(newRows);
    setIsOpenRepeatPopup(false);
  };

  const orderByDatetime: any = (arr: Array<any>) => {
    // @ts-ignore
    return arr.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  };

  const refreshRecords = () => {
    const newRows = orderByDatetime([...rows]);
    setRows(newRows);
    setValue("campaignClaimConfig", JSON.stringify(newRows));
    // alert('Sort all records by Start Time done.')
  };

  const deleteAllRecords = () => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm("Do you want delete all records ?")) {
      return false;
    }
    setRows([]);
    setValue("campaignClaimConfig", JSON.stringify([]));
  };

  const deleteRecord = (e: any, row: any, index: number) => {
    console.log("ROW: ", row, index);
    // eslint-disable-next-line no-restricted-globals
    if (!confirm("Do you want delete this record ?")) {
      return false;
    }

    const newRows = [...rows];
    if (index > -1) {
      newRows.splice(index, 1);
    }
    setRows(newRows);
    setValue("campaignClaimConfig", JSON.stringify(newRows));
  };

  const watchClaimType = watch("claim_type");

  return (
    <>
      {isOpenEditPopup && (
        <CreateEditClaimConfigForm
          isOpenEditPopup={isOpenEditPopup}
          setIsOpenEditPopup={setIsOpenEditPopup}
          renderError={renderError}
          editData={editData}
          isEdit={isEdit}
          handleCreateUpdateData={handleCreateUpdateData}
        />
      )}
      {isOpenRepeatPopup && (
        <RepeatClaimConfigForm
          isOpenRepeatPopup={isOpenRepeatPopup}
          setIsOpenRepeatPopup={setIsOpenRepeatPopup}
          // renderError={renderError}
          handleCreateRepeatData={handleCreateRepeatData}
        />
      )}
      <div>
        <label className={classes.exchangeRateTitle}>Claim Configuration</label>
      </div>

      <ClaimPolicy
        poolDetail={poolDetail}
        register={register}
        setValue={setValue}
        errors={errors}
        control={control}
        watch={watch}
      />

      <ClaimType
        poolDetail={poolDetail}
        register={register}
        setValue={setValue}
        errors={errors}
        control={control}
        watch={watch}
      />

      {watchClaimType !== CLAIM_TYPE.CLAIM_ON_THE_PROJECT_WEBSITE && (
        <>
          <div className={`${classes.formControl} ${classes.flexRow}`}>
            <Button
              variant="contained"
              color="primary"
              onClick={openPopupCreate}
            >
              Create
            </Button>
            <Button
              variant="contained"
              className={classes.btnGreen}
              onClick={openPopupRepeat}
              style={{ marginLeft: 10 }}
            >
              Repeat
            </Button>
            <Button
              variant="contained"
              className={classes.btnGreen}
              onClick={refreshRecords}
              style={{ marginLeft: "auto" }}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={deleteAllRecords}
              style={{ marginLeft: 10 }}
            >
              Delete All
            </Button>
          </div>

          <TableContainer component={Paper}>
            <Table className={classesTable.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Start Time</TableCell>
                  <TableCell align="right">Max Claim (%)</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row: any, index: number) => {
                  let startTime = row.startTime || "--";
                  let maxBuy = new BigNumber(row.maxBuy || "0").toFixed();
                  return (
                    <TableRow key={index}>
                      <TableCell>{startTime}</TableCell>
                      <TableCell align="right">{maxBuy} %</TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={(e) => openPopupEdit(e, row, index)}
                        >
                          Edit
                        </Button>

                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={(e) => deleteRecord(e, row, index)}
                          style={{ marginLeft: 10, marginTop: 0 }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {watchClaimType === CLAIM_TYPE.CLAIM_A_PART_OF_TOKENS_ON_LAUNCHPAD && (
            <>
              <RemainingTokens
                poolDetail={poolDetail}
                register={register}
                setValue={setValue}
                errors={errors}
                control={control}
                watch={watch}
              />
            </>
          )}

          <input
            type="hidden"
            name="campaignClaimConfig"
            value={JSON.stringify(rows)}
            ref={register({
              // required: true
            })}
          />
        </>
      )}

      {watchClaimType === CLAIM_TYPE.CLAIM_ON_THE_PROJECT_WEBSITE && (
        <>
          <FirstTimeClaimPhase
            poolDetail={poolDetail}
            register={register}
            setValue={setValue}
            errors={errors}
            control={control}
            watch={watch}
          />
          <ClaimGuide
            poolDetail={poolDetail}
            register={register}
            setValue={setValue}
            errors={errors}
            control={control}
            watch={watch}
          />
        </>
      )}
    </>
  );
}

export default ClaimConfigTable;
