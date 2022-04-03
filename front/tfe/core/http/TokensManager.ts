import * as SecureStore from "expo-secure-store";
import { SecureStoreKeys } from "../../declarations/types";

/**
 * Communication with expo-secure-store for setting/getting authorization tokens.
 *  */
const TokensManager = (() => {
  return {
    getAccessToken: async (): Promise<string | null> => {
      return await SecureStore.getItemAsync(SecureStoreKeys.ACCESS_TOKEN);
    },
    setAccessToken: async (token: string) => {
      if (token.length === 0) {
        console.warn(
          "TokensManager::setAccessToken - token of length 0 cannot be considered as valid"
        );
      } else {
        return await SecureStore.setItemAsync(
          SecureStoreKeys.ACCESS_TOKEN,
          token
        );
      }
    },
    getRefreshToken: async (): Promise<string | null> => {
      return await SecureStore.getItemAsync(SecureStoreKeys.REFRESH_TOKEN);
    },
    setRefreshToken: async (token: string) => {
      if (token.length === 0) {
        console.warn(
          "TokensManager::setRefreshToken - token of length 0 cannot be considered as valid"
        );
      } else {
        return await SecureStore.setItemAsync(
          SecureStoreKeys.REFRESH_TOKEN,
          token
        );
      }
    },
  };
})();

// Default export will make TokensManager a singleton
export default TokensManager;
