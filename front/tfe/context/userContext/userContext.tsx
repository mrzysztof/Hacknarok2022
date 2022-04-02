import React from "react";

type User =
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
  login: (email: string, password: string) => void;
}

export interface IUserContext extends IUserContextState, IUserContextActions {}

//Initial State and Actions
const initialState: IUserContextState = {
  user: false,
};

enum UserContextActions {
  LOGIN = "LOGIN",
  REFRESH_TOKENS = "REFRESH_TOKENS",
}

export const userContext = React.createContext<IUserContext>({
  ...initialState,
  login: () => {},
});

const reducer = (
  state: IUserContextState,
  action: Action
): IUserContextState => {
  switch (action.type) {
    case UserContextActions.LOGIN:
      return state;
      break;
    default:
      return state;
  }
};

/**
 * Context containg logic for user (authentication and other services)
 *
 */
export const UserContextProvider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const value: IUserContext = {
    ...state,
    login: (email: string, password: string) => {
      console.log("login", { email, password });
      dispatch({
        type: UserContextActions.LOGIN,
        payload: { email, password },
      });
    },
  };

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
};
