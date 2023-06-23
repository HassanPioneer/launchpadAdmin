import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { BaseRequest } from "../../request/Request";
import { referralActions } from "../constants/referrals";

const queryString = require("query-string");

export const getTopReferral = (searchingAddress: string) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    const baseRequest = new BaseRequest();

    dispatch({ type: referralActions.TOP_REFERRAL_LOADING });

    let url = `/admin/top-referrals`;
    if (!!searchingAddress) url += `?wallet_address=${searchingAddress}`;

    try {
      const response = (await baseRequest.get(url)) as any;
      const resObject = await response.json();

      if (resObject.status === 200) {
        const { total, page, lastPage, data } = resObject.data;

        dispatch({
          type: referralActions.TOP_REFERRAL_SUCCESS,
          payload: {
            total,
            page,
            lastPage,
            data,
          },
        });
      } else {
        dispatch({
          type: referralActions.TOP_REFERRAL_FAILURE,
          payload: null,
        });
      }
    } catch (err: any) {
      console.log(err);
      dispatch({
        type: referralActions.TOP_REFERRAL_FAILURE,
        payload: err.message,
      });
    }
  };
};

export const getListReferral = (
  currentPage: number = 1,
  wallet: string = "",
  sort_field: "earn_allocation" | "successful" | null = null,
  sort_type: "asc" | "desc" = "asc"
) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    const baseRequest = new BaseRequest();

    dispatch({ type: referralActions.REFERENCE_USERS_LIST_LOADING });

    // /admin/referral-info-list?sort_field=earn_allocation&sort_type=desc",
    let url = `/admin/referral-info-list`;
    const queryParams = {
      page: currentPage,
    };
    url += "?" + queryString.stringify(queryParams);
    if (wallet) url += `&wallet_address=${wallet}`;
    if (sort_field) url += `&sort_field=${sort_field}&sort_type=${sort_type}`;

    try {
      const response = (await baseRequest.get(url)) as any;
      const resObject = await response.json();

      if (resObject.status === 200) {
        const { total, page, lastPage, data } = resObject.data;

        dispatch({
          type: referralActions.REFERENCE_USERS_LIST_SUCCESS,
          payload: {
            total,
            page,
            lastPage,
            data,
          },
        });
      } else {
        dispatch({
          type: referralActions.REFERENCE_USERS_LIST_FAILURE,
          payload: null,
        });
      }
    } catch (err: any) {
      dispatch({
        type: referralActions.REFERENCE_USERS_LIST_FAILURE,
        payload: err.message,
      });
    }
  };
};
