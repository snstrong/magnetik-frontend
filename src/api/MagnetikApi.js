import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

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

  /** Create new writespace.
   * @param writespaceData {
        title,
        username,
        width,
        height,
      }
    * Returns {username, writespaceId}
   */
  static async createWritespace(writespaceData) {
    let res = await this.request(
      `writespace/${writespaceData.username}`,
      writespaceData,
      "post"
    );
    return res;
  }

  /** Populate writespace_words
   * @param writespaceData {writespaceId, username, wordTiles}
   * Returns {success: true, inserted: 1, writespaceId}
   */

  static async populateWritespace(writespaceData) {
    let res = await this.request(
      `writespace/${writespaceData.username}/${writespaceData.writespaceId}`,
      writespaceData,
      "post"
    );
    return res;
  }

  /** Get data for one writespace.
   * @param queryData {username, writespaceId}
   * Returns {writespace, writespaceData}
   */

  static async getWritespace({ username, writespaceId }) {
    let res = await this.request(`writespace/${username}/${writespaceId}`);
    return res;
  }
}

export default MagnetikApi;
