import configureStore from '../store/configureStore';
import { logout } from '../store/actions/user';
const MESSAGE_SIGNATURE = process.env.REACT_APP_MESSAGE_SIGNATURE || "";

export class BaseRequest {
  static getInstance() {
    return new this
  }

  getSignatureMessage(isInvestor: boolean = false) {
    const msgSignature = MESSAGE_SIGNATURE;
    return msgSignature;
  }

  getHeader(isInvestor: boolean = false) {
    const token = localStorage.getItem('access_token');

    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
      msgSignature: this.getSignatureMessage(isInvestor),
    }
  }

  buildUrl(url: string) {
    // remove both leading and trailing a slash
    url = url.replace(/^\/+|\/+$/g, '')
    return `${this.getUrlPrefix()}/${url}`
  }

  getUrlPrefix() {
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    return BASE_URL;
  }

  async post(url: string, data: object, isInvestor: boolean = false) {
    let resObj: Response;

    try {
      return fetch(this.buildUrl(url), {
        method: "POST",
        headers: this.getHeader(isInvestor),
        body: JSON.stringify(data)
      })
      .then(response => {
        resObj = response.clone();
        return response.json();
      }).catch(err =>console.log(err))
      .then(data => {
        if (data.status && data.status === 401) {
          if (data.message === 'Token Expired') {
            configureStore().store.dispatch(logout(isInvestor));
          }
        }

        return resObj;
      }).catch(err =>console.log(err))
    } 
    
    
    catch (e) {
      throw e;
    }

    
  }

  async postImage(url: string, data: FormData ) {
    try {
      return (fetch(this.buildUrl(url), {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        },
        body: data
      }));
    } catch (e) {
      throw e;
    }
  }

  async put(url: string, data: object) {
    try {
      return this._responseHandler(fetch(this.buildUrl(url), {
        method: "PUT",
        headers: this.getHeader(),
        body: JSON.stringify(data)
      }));
    } catch (e) {
      throw e;
    }
  }

  async patch(url: string, data: object) {
    try {
      return this._responseHandler(fetch(this.buildUrl(url), {
        method: "PATH",
        headers: this.getHeader(),
        body: JSON.stringify(data)
      })).catch((e: any) => console.log(e.message));
    } catch (e) {
      throw e;
    }
  }

  async get(url: string, isInvestor: boolean = false) {
    let resObj: Response;

    try {
      return fetch(this.buildUrl(url), {
        method: "GET",
        headers: this.getHeader(),
      })
      .then(response => {
        resObj = response.clone();
        return response.json();
      }).catch(err =>console.log(err))
      .then(data => {
        if (data.status && data.status === 401 && data.message === 'Token Expired') {
          configureStore().store.dispatch(logout(isInvestor));
        }

        return resObj;
      }).catch(err =>console.log(err))
    } catch (e) {
      throw e;
    }
  }

  async delete(url: string,  data: object) {
    try {
      return this._responseHandler(fetch(this.buildUrl(url), {
        method: "DELETE",
        headers: this.getHeader(),
        body: JSON.stringify(data)
      }));
    } catch (e) {
      throw e;
    }
  }

  async _responseHandler(response = {}) {
    return response;
  }

  async postDownload(url: string, data: object) {
    const res = await fetch(this.buildUrl(url), {
      method: "POST",
      headers: this.getHeader()
    })
    return res.blob()
  }
}
