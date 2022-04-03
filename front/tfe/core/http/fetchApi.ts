import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
// import { DEV_API, NODE_ENV, PROD_API } from "@env";
// import { TokenPair } from "../../declarations/types";
import TokensManager from "./TokensManager";
import { isJwtExpired } from "../../utils/isJwtExpired";

// Base API url on module import
const apiUrl = "https://floating-escarpment-35869.herokuapp.com";

type fetchArgs = {
  requestConfig: AxiosRequestConfig;
};

const tokensHealthcheck = async (): Promise<string | undefined> => {
  let accessToken = await TokensManager.getAccessToken();
  let refreshToken = await TokensManager.getRefreshToken();

  if (!accessToken) return undefined;

  if (isJwtExpired(accessToken)) return undefined;

  return accessToken;
};

// For unprotected routes
const unathFetch = async (
  url: string,
  args: fetchArgs
): Promise<AxiosResponse> => {
  try {
    const { requestConfig: requestLibraryConfig } = args;
    console.log(requestLibraryConfig);
    const response = await axios(url, requestLibraryConfig);

    return response;
  } catch (error) {
    // @ts-ignore
    // console.log(error.response.data)
    // // @ts-ignore
    // console.log(error.response.statusText)
    // // @ts-ignore
    // console.log(error.response.request)
    // @ts-ignore
    console.log(error.toJSON());
    // @ts-ignore
    console.log(Object.keys(error));
    console.log(String(error));
    console.warn(error);
    throw error;
  }
};

const authFetch = async (url: string, args: fetchArgs) => {
  try {
    const { requestConfig: requestLibraryConfig } = args;

    let config = requestLibraryConfig;

    const accessToken = await tokensHealthcheck();

    if (accessToken === undefined)
      throw new Error("authFetch: Cannot obtain new tokens");

    // Attach access token to the request
    config = {
      ...config,
      headers: {
        ...config.headers,
        "x-access-token": accessToken,
      },
    };

    const response = await axios(url, config);

    return response;
  } catch (error) {
    console.warn(error);
    throw error;
  }
};

/**
 * Helper function that wrapps fetching logic implemented with Axios.
 *
 * Takes generic to denote type returned from request.
 *
 * @param {fetchArgs} args
 *  */
export const fetchApi = async <RES>(
  path: string,
  args: fetchArgs,
  authorizedRequest: boolean = false
): Promise<RES> => {
  const fullPath = `${apiUrl}${path}`;
  const response = await (async () => {
    if (authorizedRequest) {
      return await authFetch(fullPath, args);
    } else {
      console.log("unath");
      return await unathFetch(fullPath, args);
    }
  })();

  console.log(Object.keys(response));

  if (response.status >= 400) throw new Error(response.statusText);

  return response.data as RES;
};
