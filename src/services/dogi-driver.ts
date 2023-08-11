import axios from "axios";
import { TOKEN_NAME } from "constant";
import { DOGI_API_LOCAL_URL, DOGI_API_URL } from "../config";

const url =
  window.location.hostname === "localhost" ? DOGI_API_LOCAL_URL : DOGI_API_URL;

/**
 * @example
 * ```ts
 *  dogiDriver.get("/product").then(...);
 * ```
 */
const dogiDriver = axios.create({
  // baseURL: DOGI_API_LOCAL_URL,
  // baseURL: DOGI_API_URL,
  baseURL: url,
});

dogiDriver.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(TOKEN_NAME);
  if (config.headers) {
    Object.assign(config.headers, {
      Authorization: token ? `Bearer ${token}` : "",
    });
  } else {
    config.headers = {
      Authorization: token ? `Bearer ${token}` : "",
    };
  }
  return config;
});

dogiDriver.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    if ("message" in err.response.data) {
      return Promise.reject<string>(err.response.data.message);
    }
    return Promise.reject<string>(err.message);
  }
);

export default dogiDriver;
