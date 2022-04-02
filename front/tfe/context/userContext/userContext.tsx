import React from "react";

export type User =
  | {
      id: string;
      email: string;
      configuration: {};
    }
  | boolean;

interface IUserContextState {
  user: User;
}

interface Action {
  type: UserContextActions;
  payload: any;
}

interface IUserContextActions {
  login: (email: string, password: string) => Promise<void>;
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
    login: async (email: string, password: string) => {
      // @todo: use serice
      dispatch({
        type: UserContextActions.LOGIN,
        payload: { email, password },
      });
    },
    fetchUser: async () => {
      // @todo: use serice
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          dispatch({
            type: UserContextActions.FETCH_USER,
            payload: {
              id: "123-asd",
              email: "string@jasndjkasd.com",
              configuration: {},
            },
          });
          resolve(true);
        }, 1500);
      });
    },
  };

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
};
