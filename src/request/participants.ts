import moment from 'moment';
import { BaseRequest } from "./Request";
import { apiRoute } from "../utils";
import FileDownload from 'js-file-download'
import { EXPORT_USER_TYPE } from "../constants"
const queryString = require('query-string');

/**
 * PARTICIPANTS
 */
export const getParticipantUser = async (campaignId: any, params: any = {}) => {
  const baseRequest = new BaseRequest();

  // Fetch from API Protect by Auth Admin (with prefix)
  const queryParams = queryString.stringify(params);
  let url = apiRoute(`/pool/${campaignId}/participants?${queryParams}`);
  const response = await baseRequest.get(url) as any;
  const resObject = await response.json();

  return resObject;
};

export const addParticipantUser = async (campaignId: any, data: any = {}) => {
  const baseRequest = new BaseRequest();

  let url = apiRoute(`/pool/${campaignId}/participants/add`);
  const response = await baseRequest.post(url, data) as any;
  const resObject = await response.json();

  return resObject;
};

export const pickerRandomWinner = async (campaignId: any, rule: string = 'rule-lucky-and-weight') => {
  const baseRequest = new BaseRequest();
  console.log('campaignId', campaignId);

  // pool/winner-random/:campaignId/:number
  let url = apiRoute(`/pool/winner-random/${campaignId}/${rule}`);
  const response = await baseRequest.post(url, {}) as any;
  const resObject = await response.json();

  return resObject;
};

/**
 * WINNERS
 */
export const getWinnerUser = async (campaignId: any, params: any = {}) => {
  const baseRequest = new BaseRequest();

  // Fetch from API Protect by Auth Admin (with prefix)
  const queryParams = queryString.stringify(params);
  let url = apiRoute(`/pool/${campaignId}/winners?${queryParams}`);
  const response = await baseRequest.get(url) as any;
  const resObject = await response.json();

  return resObject;
};

export const deleteWinnerUser = async (campaignId: any, data: any = {}) => {
  const baseRequest = new BaseRequest();

  let url = apiRoute(`/pool/${campaignId}/winners/${data.wallet_address}/delete`);
  const response = await baseRequest.delete(url, data) as any;
  const resObject = await response.json();

  return resObject;
};

export const exportParticipants = async (campaignId: any, data: any = {}) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/users/download?campaign_id=${campaignId}&type=${EXPORT_USER_TYPE.USER_PARTICIPANT}`);
  const fileData = await baseRequest.postDownload(url, data) as any;
  FileDownload(fileData, `user_participant_${campaignId}_${moment().format('DD_MM_YYYY')}.csv`);
}

export const exportWinner = async (campaignId: any, data: any = {}) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/users/download?campaign_id=${campaignId}&type=${EXPORT_USER_TYPE.USER_WINNER}`);
  const fileData = await baseRequest.postDownload(url, data) as any;
  FileDownload(fileData, `user_winner_${campaignId}_${moment().format('DD_MM_YYYY')}.csv`);
}
