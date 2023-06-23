import { BaseRequest } from "./Request";
import { apiRoute } from "../utils";

export const getStatistic = async () => {
    const baseRequest = new BaseRequest();
    let url = apiRoute(`/statistic`);
    const response = await baseRequest.get(url) as any;
    const resObject = await response.json();

    return resObject;
};

export const updateStatistic = async (params: any) => {
    const baseRequest = new BaseRequest();
    let url = apiRoute(`/statistic/update`);
    const response = await baseRequest.post(url, params) as any;
    const resObject = await response.json();

    return resObject;
}
