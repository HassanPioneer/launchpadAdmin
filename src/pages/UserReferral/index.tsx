import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import DefaultLayout from "../../components/Layout/DefaultLayout";
import {
  getReferenceLinks,
  updateReferenceLinks,
} from "../../request/referrals";
import { alertFailure, alertSuccess } from "../../store/actions/alert";
import { useCommonStyle } from "../../styles";
import FullGuide from "./Components/FullGuide";
import OnboardingProcess from "./Components/OnboardingProcess";
import ReferralBenefits from "./Components/ReferralBenefits";
import ReferralProgram from "./Components/ReferralProgram";
import useStyles from "./style";
import TabAllUsers from "./TabAllUsers";
import TabTopReferral from "./TabTopReferral";

const ACTIVE_TABS = {
  ALL_USERS: 1,
  TOP_REFERRAL: 2,
};

const UserReferral: React.FC<any> = (props: any) => {
  const classes = useStyles();
  const commonStyle = useCommonStyle();

  const dispatch = useDispatch();

  const [search, setSearch] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [referenceLink, setReferenceLink] = useState<any>({});
  const [updateRefLinkLoading, setUpdateRefLinkLoading] =
    useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(ACTIVE_TABS.ALL_USERS);

  const {
    register,
    setValue,
    getValues,
    clearErrors,
    errors,
    handleSubmit,
    control,
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: referenceLink,
    reValidateMode: "onChange",
  });

  useEffect(() => {
    getReferenceLinks()
      .then(async (res) => {
        if (res.status !== 200) {
          dispatch(
            alertFailure(
              "Server Error: " + (res.message || "Load reference link fail !!!")
            )
          );
          return false;
        }
        let data = res.data;

        setReferenceLink(data);

        return data;
      })
      .catch((e) => {
        console.log("Error: ", e);
        dispatch(alertFailure("Reference link load fail !!!"));
      });
  }, []);

  const onEdit = () => {
    setIsEditing(true);
  };
  const handleFormSubmit = async (data: any) => {
    setUpdateRefLinkLoading(true);
    try {
      const response: any = await updateReferenceLinks(data);
      if (response?.status === 200) {
        dispatch(alertSuccess("Successful!"));
        setIsEditing(false);
      } else {
        dispatch(alertFailure("Fail!"));
      }
      setUpdateRefLinkLoading(false);
    } catch (e) {
      setUpdateRefLinkLoading(false);
      console.log("ERROR: ", e);
    }
  };
  const onSave = () => {
    handleSubmit(handleFormSubmit)();
  };

  const onSearch = debounce((e: any) => {
    setSearch(e.target.value);
  }, 500);

  //#region RENDER
  const renderReferralLink = () => {
    return (
      <div className={classes.referralLink}>
        <div className={classes.formTitle}>
          <span className={classes.title}>REFERENCE LINK</span>
          {isEditing ? (
            <>
              <button
                className={classes.btnImage + " " + classes.btnSave}
                onClick={onSave}
                disabled={updateRefLinkLoading}
              >
                <img src="/images/icon-save.svg" alt="" />
                <span>SAVE</span>
              </button>
              <button
                className={classes.btnImage + " " + classes.btnCancel}
                onClick={() => setIsEditing(false)}
                disabled={updateRefLinkLoading}
              >
                <img src="/images/icon-close.svg" alt="" />
                <span>CANCEL</span>
              </button>
            </>
          ) : (
            <button
              className={classes.btnImage + " " + classes.btnEdit}
              onClick={onEdit}
            >
              <img src="/images/icon-edit.svg" alt="" />
              <span>EDIT</span>
            </button>
          )}
        </div>
        <div></div>

        <ReferralProgram
          setValue={setValue}
          errors={errors}
          control={control}
          register={register}
          watch={watch}
          disabled={!isEditing}
          referenceLinks={referenceLink}
        />
        <FullGuide
          setValue={setValue}
          errors={errors}
          control={control}
          register={register}
          watch={watch}
          disabled={!isEditing}
          referenceLinks={referenceLink}
        />
        <OnboardingProcess
          setValue={setValue}
          errors={errors}
          control={control}
          register={register}
          watch={watch}
          disabled={!isEditing}
          referenceLinks={referenceLink}
        />
        <ReferralBenefits
          setValue={setValue}
          errors={errors}
          control={control}
          register={register}
          watch={watch}
          disabled={!isEditing}
          referenceLinks={referenceLink}
        />
      </div>
    );
  };

  const renderUserList = () => {
    return (
      <div className={classes.userList}>
        <div className={classes.formTitle}>
          <span className={classes.title}>REFERRAL USER LIST</span>

          <div className={commonStyle.boxSearch} style={{ marginLeft: "auto" }}>
            <input
              className={commonStyle.inputSearch}
              onChange={onSearch}
              placeholder="Search"
            />
            <img
              className={commonStyle.iconSearch}
              src="/images/icon-search.svg"
              alt=""
            />
          </div>
        </div>
        <ul className={`multilTabBottom ${classes.navBottom}`}>
          <li
            onClick={() => setActiveTab(ACTIVE_TABS.ALL_USERS)}
            className={activeTab === ACTIVE_TABS.ALL_USERS ? "active" : ""}
          >
            All users
          </li>
          <li
            onClick={() => setActiveTab(ACTIVE_TABS.TOP_REFERRAL)}
            className={activeTab === ACTIVE_TABS.TOP_REFERRAL ? "active" : ""}
          >
            Top Referral of month
          </li>
        </ul>

        <TabAllUsers
          showTab={activeTab === ACTIVE_TABS.ALL_USERS}
          search={search}
        />
        <TabTopReferral
          showTab={activeTab === ACTIVE_TABS.TOP_REFERRAL}
          search={search}
        />
      </div>
    );
  };
  //#endregion RENDER

  return (
    <DefaultLayout>
      <div className={classes.container}>
        {renderReferralLink()}

        {renderUserList()}
      </div>
    </DefaultLayout>
  );
};

export default UserReferral;
