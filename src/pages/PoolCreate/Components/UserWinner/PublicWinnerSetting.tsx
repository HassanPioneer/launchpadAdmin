import React, {useEffect, useState} from 'react';
import {Collapse, Switch} from "antd";
import Grid from "@material-ui/core/Grid";
import {useCommonStyle} from "../../../../styles";
import useStylesTable from "./style_table";
import {withRouter} from "react-router";
import {Controller} from "react-hook-form";
import {useDispatch} from "react-redux";
import {renderErrorCreatePool} from "../../../../utils/validate";
import FormControl from "@material-ui/core/FormControl";
import useStyles from "../../style";
import {changePublicWinnerStatus, importWinner} from "../../../../request/pool";
import {alertSuccess,alertFailure} from "../../../../store/actions/alert";
import { Button } from "@material-ui/core";
import { POOL_IS_PRIVATE } from "../../../../constants";

const { Panel } = Collapse;

function callback(key: any) {
  console.log(key);
}

function PublicWinnerSetting(props: any) {
  const commonStyle = useCommonStyle();
  const classes = useStyles();
  const dispatch = useDispatch();
  const renderError = renderErrorCreatePool;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(false);
  const [importResponse, setImportResponse] = useState('');

  const {
    setValue, errors, control,
    poolDetail,
  } = props;

  useEffect(() => {
    if (poolDetail) {
      console.log('poolDetail.public_winner_status: ', poolDetail.public_winner_status);
      setValue('public_winner_status', !!poolDetail.public_winner_status);
    }
  }, [poolDetail]);

  const changeDisplay = async (value: any) => {

    console.log('Change Status');

    const res = await changePublicWinnerStatus({
      pool_id: poolDetail.id,
      public_winner_status: value,
    });
    console.log('Change Public Winner: Response: ', res);
    if (res.status === 200) {
      dispatch(alertSuccess('Change Public Winner Setting successful!'));
    }
    return value;
  };

  const handleSelectCSVFile = (e: any) => {
    setSelectedFile(e.target.files[0]);
  }

  const handleImportCSV = async () => {
    setImportResponse('');
    const res = await importWinner(poolDetail.id, selectedFile)

    dispatch((res.status === 200 ? alertSuccess : alertFailure)(res.message));
    if (res.status === 200) {
      setImportResponse(`Total: ${res.data?.total} --- Added: ${res.data?.added} --- Updated: ${res.data?.updated} --- Duplicated: ${res.data?.duplicated}`);
    }
  }

  return (
    <>
      <div className={commonStyle.boxSearch} style={{ marginBottom: 25 }}>
        <Collapse onChange={callback} defaultActiveKey={['1']}>
          <Panel header="Public Winner Settings" key="1">
            <Grid container spacing={3}>
              <Grid item xs={4}>

                <>
                  <div><label className={classes.formControlLabel}>Public Winner</label></div>
                  <FormControl component="fieldset">
                    <Controller
                      control={control}
                      name="public_winner_status"
                      render={(field) => {
                        const { value, onChange } = field;
                        return (
                          <Switch
                            onChange={ async (switchValue) => {
                              // eslint-disable-next-line no-restricted-globals
                              if (!confirm('Do you want change this setting ?')) {
                                return false;
                              }
                              await onChange(switchValue);
                              await changeDisplay(switchValue);
                            }}
                            checked={value}
                            checkedChildren="Public"
                            unCheckedChildren="Hidden"
                          />
                        )
                      }}
                    />

                    <p className={classes.formErrorMessage}>
                      {
                        renderError(errors, 'public_winner_status')
                      }
                    </p>
                  </FormControl>
                  <br/>
                </>



              </Grid>

              <Grid item xs={6}>
                <Grid item>
                  <input
                    // className={styles.inputG}
                    color="primary"
                    style={{ marginLeft: '10px' }}
                    type="file"
                    accept=".csv, .xlsx"
                    onChange={handleSelectCSVFile}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginLeft: '10px' }}
                    onClick={handleImportCSV}
                  >Import FCFS</Button>
                </Grid>

                <div className={commonStyle.boxSearch}>
                  {importResponse ? <p>{importResponse}</p> : <p></p>}
                </div>
             </Grid>


            </Grid>
          </Panel>
        </Collapse>


      </div>
    </>
  );
}
export default withRouter(PublicWinnerSetting);
