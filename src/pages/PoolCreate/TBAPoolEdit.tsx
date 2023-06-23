import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import BackButton from "../../components/Base/ButtonLink/BackButton";
import DefaultLayout from "../../components/Layout/DefaultLayout";
import { getTBAPoolDetail } from "../../request/pool";
import { alertFailure } from "../../store/actions/alert";
import { adminRoute } from "../../utils";
import useStyles from "./style";
import TBAPoolForm from "./TBAPoolForm";

const TBAPoolEdit: React.FC<RouteComponentProps> = (
  props: RouteComponentProps
) => {
  const { match } = props;
  const dispatch = useDispatch();
  const styles = useStyles();
  const [poolDetail, setPoolDetail] = useState({});

  // @ts-ignore
  const id = match.params?.id;

  useEffect(() => {
    getTBAPoolDetail(id)
      .then(async (res) => {
        if (res.status !== 200) {
          dispatch(
            alertFailure(
              "Server Error: " + (res.message || "Load pool fail !!!")
            )
          );
          return false;
        }
        let data = res.data;

        setPoolDetail(data);

        return data;
      })
      .catch((e) => {
        console.log("Error: ", e);
        dispatch(alertFailure("Pool load fail !!!"));
      });
  }, [id]);

  return (
    <DefaultLayout>
      <div className={styles.listButton}>
        <BackButton to={adminRoute("/tba-campaigns")} />
      </div>
      <TBAPoolForm isEdit={true} poolDetail={poolDetail} />
    </DefaultLayout>
  );
};

export default withRouter(TBAPoolEdit);
