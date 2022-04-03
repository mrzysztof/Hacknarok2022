export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

export enum SecureStoreKeys {
  ACCESS_TOKEN = "ACCESS_TOKEN",
  REFRESH_TOKEN = "REFRESH_TOKEN",
}

export type User = {
  id: string;
  email: string;
  configuration: UserConfiguration;
};

export enum DashboardActionTypes {
  CALL = "CALL",
  WEATHER = "WEATHER",
  CALENDAR = "CALENDAR"
}

export type DashboardActionConfiguration = {
  type: DashboardActionTypes,
  callContacts?: {
    name: string;
    number: string
  }[]
}

export type UserConfiguration = DashboardActionConfiguration[];
