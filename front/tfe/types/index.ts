export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

export enum SecureStoreKeys {
  ACCESS_TOKEN = "ACCESS_TOKEN",
  REFRESH_TOKEN = "REFRESH_TOKEN",
}
