import React from "react";
import { userService } from "../../core/services";
import { User } from "../../declarations/types";

interface IUserContextState {
  user: User | boolean;
}

interface Action {
  type: UserContextActions;
  payload: any;
}

interface IUserContextActions {
  login: (username: string, password: string) => Promise<void>;
  fetchUser: () => Promise<boolean>;
}

export interface IUserContext extends IUserContextState, IUserContextActions {}

//Initial State and Actions
const initialState: IUserContextState = {
  user: false,
};

enum UserContextActions {
  LOGIN = "LOGIN",
  FETCH_USER = "FETCH_USER",
}

export const userContext = React.createContext<IUserContext>({
  ...initialState,
  login: async () => {},
  fetchUser: async () => false,
});

const reducer = (
  state: IUserContextState,
  action: Action
): IUserContextState => {
  switch (action.type) {
    case UserContextActions.LOGIN:
      return state;
      break;
    case UserContextActions.FETCH_USER:
      return {
        ...state,
        user: action.payload,
      };
      break;
    default:
      return state;
  }
};

/**
 * Context containing logic for user (authentication and other services)
 *
 */
export const UserContextProvider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const value: IUserContext = {
    ...state,
    login: async (username: string, password: string) => {
      const loginRes = await userService.login(username, password);
      // @todo: use serice
      dispatch({
        type: UserContextActions.LOGIN,
        payload: { username, password },
      });
    },
    fetchUser: async () => {
      // @todo: use serice
      return new Promise((resolve, reject) => {
        resolve(true);
        dispatch({
          type: UserContextActions.FETCH_USER,
          payload: false,
          //   payload: {
          //     id: "123-asd",
          //     email: "string@jasndjkasd.com",
          //     configuration: [
          //       {
          //         type: DashboardActionTypes.CALENDAR,
          //       },
          //       {
          //         type: DashboardActionTypes.CALL,
          //         callContacts: [
          //           {
          //             name: "Walter White",
          //             number: "9365902137",
          //           },
          //           {
          //             name: "Jane Doe",
          //             number: "9365909477",
          //           },
          //           {
          //             name: "Timmy Light",
          //             number: "9365909000",
          //           },
          //         ],
          //       },
          //       {
          //         type: DashboardActionTypes.WEATHER,
          //       },
          //     ],
          //   },
        });
      });
    },
  };

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
};
