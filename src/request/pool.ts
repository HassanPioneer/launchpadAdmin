import {BaseRequest} from "./Request";
import {apiRoute} from "../utils";

export const createTBAPool = async (data: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute('/tba-pool/create');

  const response = await baseRequest.post(url, data) as any;
  const resObject = await response.json();
  return resObject;
};

export const updateTBAPool = async (data: any, id: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/tba-pool/${id}/update`);

  const response = await baseRequest.post(url, data) as any;
  const resObject = await response.json();
  return resObject;
};

export const deleteTBAPool = async (id: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/tba-pool/${id}`);

  const response = await baseRequest.delete(url, {}) as any;
  const resObject = await response.json();
  return resObject;
};

export const getTBAPoolDetail = async (id: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/tba-pool/${id}`);

  const response = await baseRequest.get(url) as any;
  const resObject = await response.json();
  return resObject;
};

export const createPool = async (data: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute('/pool/create');

  const response = await baseRequest.post(url, data) as any;
  const resObject = await response.json();
  return resObject;
};

export const updatePool = async (data: any, id: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/pool/${id}/update`);

  const response = await baseRequest.post(url, data) as any;
  const resObject = await response.json();
  return resObject;
};

export const getPoolDetail = async (id: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/pool/${id}`);

  const response = await baseRequest.get(url) as any;
  const resObject = await response.json();
  return resObject;
};

export const updateDeploySuccess = async (data: any, id: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/pool/${id}/deploy-success`);

  const response = await baseRequest.post(url, data) as any;
  const resObject = await response.json();
  return resObject;
};

export const changeDisplayStatus = async (data: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/pool/${data.poolId}/change-display`);

  const response = await baseRequest.post(url, {
    is_display: data.isDisplay,
  }) as any;

  const resObject = await response.json();
  return resObject;
};

export const changePublicWinnerStatus = async (data: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/pool/${data.pool_id}/change-public-winner-status`);

  const response = await baseRequest.post(url, {
    public_winner_status: data.public_winner_status,
  }) as any;

  const resObject = await response.json();
  return resObject;
};

export const depositPoolAdmin = async (data: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute('/deposit-admin');

  const response = await baseRequest.post(url, data) as any;
  const resObject = await response.json();
  return resObject;
};

export const importCommunityWinner = async (poolId: number, file: any) => {
  const baseRequest = new BaseRequest();
  var form_data = new FormData();
  form_data.append('winners', file);
  let url = apiRoute(`/pool/${poolId}/winners/import-community-winner`);

  const response = await baseRequest.postImage(url, form_data) as any;
  const resObject = await response.json();
  return resObject;
}

export const importWinner = async (poolId: number, file: any) => {
  const baseRequest = new BaseRequest();
  var form_data = new FormData();
  form_data.append('winners', file);
  let url = apiRoute(`/pool/${poolId}/winners/import`);

  const response = await baseRequest.postImage(url, form_data) as any;
  const resObject = await response.json();
  return resObject;
}

export const importParticipants = async (poolId: number, file: any) => {
  const baseRequest = new BaseRequest();
  var form_data = new FormData();
  form_data.append('participants', file);
  let url = apiRoute(`/pool/${poolId}/participants/import`);

  const response = await baseRequest.postImage(url, form_data) as any;
  const resObject = await response.json();
  return resObject;
}
