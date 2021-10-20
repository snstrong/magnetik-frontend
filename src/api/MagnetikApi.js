import axios from "axios";

const BASE_URL = process.env.MAGNETIK_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 *
 */

class MagnetikApi {
  static token;

  static async request(endpoint, data = {}, method = "get") {
    // console.debug("API Call:", endpoint, data, method);
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${MagnetikApi.token}` };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  //////////////////////////////
  /** Individual API requests */
  //////////////////////////////

  // Auth Requests

  /** Register a user. Returns JWT. */

  static async register(data) {
    let res = await this.request(`auth/register`, data, "post");
    MagnetikApi.token = res.token;
    return res.token;
  }

  /** Logs in a user. Returns JWT. */

  static async login(data) {
    let res = await this.request(`auth/token`, data, "post");
    MagnetikApi.token = res.token;
    return res.token;
  }

  // User Requests

  static async getCurrentUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  static async updateCurrentUser(username, data) {
    let patchData = {};
    for (let field in data) {
      if (data[field].length > 0) {
        patchData[field] = data[field];
      }
    }
    let res = await this.request(`users/${username}`, patchData, "patch");
    return res.user;
  }

  static async getWordList() {
    let res = await this.request(`writespace`);
    return res.wordList;
  }
}

export default MagnetikApi;
