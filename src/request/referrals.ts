import { apiRoute, publicRoute } from "../utils";
import { BaseRequest } from "./Request";
const queryString = require("query-string");

export const getReferenceLinks = async () => {
  const baseRequest = new BaseRequest();
  let url = publicRoute("/reference-link");

  const response = (await baseRequest.get(url)) as any;
  const resObject = await response.json();
  return resObject;
};

export const updateReferenceLinks = async (data: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute("/reference-link");

  const response = (await baseRequest.post(url, data)) as any;
  const resObject = await response.json();
  return resObject;
};

export const getReferralHistory = async (query: string) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/referral-history-list?${query}`);

  const response = (await baseRequest.get(url)) as any;
  const resObject = await response.json();
  return resObject;
};

export const pickTopReferral = async (query: string) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute("/pick-top-referral?" + query);

  const response = (await baseRequest.post(url, {})) as any;
  const resObject = await response.json();
  return resObject;
};

export const changeDisplayTopUser = async (id: number, is_display: boolean) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/top-referral/${id}/change-display`);

  const response = (await baseRequest.post(url, {
    is_display: is_display,
  })) as any;
  const resObject = await response.json();
  return resObject;
};

export const changePaidTopUser = async (id: number, is_paid: boolean) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/top-referral/${id}/change-paid?is_paid=${is_paid}`);

  const response = (await baseRequest.post(url, {})) as any;
  const resObject = await response.json();
  return resObject;
};

export const getWinnerReferrals = async (campaignId: any, params: any = {}) => {
  const baseRequest = new BaseRequest();

  const queryParams = queryString.stringify(params);
  let url = apiRoute(`/pool/${campaignId}/winner-referrals?${queryParams}`);
  const response = (await baseRequest.get(url)) as any;
  const resObject = await response.json();

  return resObject;
};
