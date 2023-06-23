import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import BackButton from "../../components/Base/ButtonLink/BackButton";
import DefaultLayout from "../../components/Layout/DefaultLayout";
import { adminRoute } from "../../utils";
import TBAPoolForm from "./TBAPoolForm";

const TBAPoolCreate: React.FC<RouteComponentProps> = (
  props: RouteComponentProps
) => {
  return (
    <DefaultLayout>
      <BackButton to={adminRoute("/tba-campaigns")} />
      <TBAPoolForm isEdit={false} />
    </DefaultLayout>
  );
};

export default withRouter(TBAPoolCreate);
