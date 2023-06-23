import { AnyAction } from "redux";
import { referralActions } from "../constants/referrals";

const initialState = {
  data: [],
  loading: false,
  failure: "",
};

export const referralListReducer = (
  state = initialState,
  action: AnyAction
) => {
  switch (action.type) {
    case referralActions.REFERENCE_USERS_LIST_LOADING: {
      return {
        ...state,
        loading: true,
        failure: "",
      };
    }

    case referralActions.REFERENCE_USERS_LIST_SUCCESS: {
      return {
        ...state,
        data: action.payload,
        loading: false,
      };
    }

    case referralActions.REFERENCE_USERS_LIST_FAILURE: {
      return {
        data: [],
        failure: action.payload,
        loading: false,
      };
    }

    default: {
      return state;
    }
  }
};

export const referralTopReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case referralActions.TOP_REFERRAL_LOADING: {
      return {
        ...state,
        loading: true,
        failure: "",
      };
    }

    case referralActions.TOP_REFERRAL_SUCCESS: {
      return {
        ...state,
        data: action.payload,
        loading: false,
      };
    }

    case referralActions.TOP_REFERRAL_FAILURE: {
      return {
        data: [],
        failure: action.payload,
        loading: false,
      };
    }

    default: {
      return state;
    }
  }
};
