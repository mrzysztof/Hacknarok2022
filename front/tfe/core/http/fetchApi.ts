import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { DEV_API, NODE_ENV, PROD_API } from "@env";
import { TokenPair } from "../../types/";
import TokensManager from "./TokensManager";
import { isJwtExpired } from "../../utils/isJwtExpired";

// Base API url on module import
const apiUrl = NODE_ENV === "development" ? DEV_API : PROD_API;

type fetchArgs = {
  requestConfig: AxiosRequestConfig;
};

const tokensHealthcheck = async (): Promise<TokenPair | undefined> => {
  let accessToken = await TokensManager.getAccessToken();
  let refreshToken = await TokensManager.getRefreshToken();

  if (!refreshToken || !accessToken) return undefined;

  if (isJwtExpired(accessToken)) {
    /**
     * @todo adjust to refresh endpoint
     */

    // Try to refresh token
    const refreshResponse = await unathFetch(apiUrl, {
      requestConfig: {
        method: "POST",
        headers: {
          /* ... */
        },
      },
    });

    if (refreshResponse.status >= 400) return undefined;

    // extract tokens from response and reassign
    const { access_token, refresh_token } = refreshResponse.data;

    await Promise.all([
      TokensManager.setAccessToken(access_token),
      TokensManager.setRefreshToken(refresh_token),
    ]);

    accessToken = access_token as string;
    refreshToken = refresh_token as string;
  }

  return {
    accessToken,
    refreshToken,
  };
};

// For unprotected routes
const unathFetch = async (
  url: string,
  args: fetchArgs
): Promise<AxiosResponse> => {
  try {
    const { requestConfig: requestLibraryConfig } = args;
    const response = await axios(url, requestLibraryConfig);

    return response;
  } catch (error) {
    console.warn(error);
    throw error;
  }
};

const authFetch = async (url: string, args: fetchArgs) => {
  try {
    const { requestConfig: requestLibraryConfig } = args;

    let config = requestLibraryConfig;

    const tokens = await tokensHealthcheck();

    if (tokens === undefined)
      throw new Error("authFetch: Cannot obtain new tokens");

    // Attach access token to the request
    config = {
      ...config,
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
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
  const response = await (async () => {
    if (authorizedRequest) {
      return await authFetch(path, args);
    } else {
      return await unathFetch(path, args);
    }
  })();

  if (response.status >= 400) throw new Error(response.statusText);

  return response.data as RES;
};
