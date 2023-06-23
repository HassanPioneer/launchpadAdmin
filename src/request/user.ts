import moment from 'moment';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import {BaseRequest} from "./Request";
import {apiRoute} from "../utils";
import FileDownload from 'js-file-download'
import { EXPORT_USER_TYPE } from "../constants"
const queryString = require('query-string');

export const getUserList = async (queryParams: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/users`);
  url += '?' + queryString.stringify(queryParams);

  const response = await baseRequest.get(url) as any;
  const resObject = await response.json();

  return resObject;
};

export const exportUserList = async () => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/users/download?type=${EXPORT_USER_TYPE.USER_LIST}`);
  const fileData = await baseRequest.postDownload(url, {}) as any;
  FileDownload(fileData, `launchpad_users_${moment().format('DD_MM_YYYY')}.csv`);
}

export const reloadCachedUserList = async () => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/users/reload`);

  const response = await baseRequest.get(url) as any;
  const resObject = await response.json();

  return resObject;
};

export const downloadUserList = async (fileId: number, fileName: string) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/users/download/${fileId}`);
  const fileData = await baseRequest.postDownload(url, {}) as any;
  FileDownload(fileData, fileName);
}

export const getFileExportList = async (params: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/users/export-files`);
  url += '?' + queryString.stringify(params);

  const response = await baseRequest.get(url) as any;
  const resObject = await response.json();

  return resObject;
}
