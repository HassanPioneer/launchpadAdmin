import {BaseRequest} from "./Request";

export const getTiers = async (campaignId: any) => {
  const baseRequest = new BaseRequest();

  let url = `/pool/${campaignId}/tiers`;
  const response = await baseRequest.get(url) as any;
  const resObject = await response.json();

  return resObject;
};
