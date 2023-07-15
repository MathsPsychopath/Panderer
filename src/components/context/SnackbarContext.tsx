import { Dispatch, createContext, useReducer } from "react";

interface ISnackbarContext {
  state: State;
  dispatch: Dispatch<Action>;
}

type Severity = "success" | "error";

type State = {
  severity: Severity;
  msg: string;
  isOpen: boolean;
};

export type Action =
  | { type: "SET_ALERT"; msg: string; severity: Severity }
  | { type: "SET_CLOSE" };

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "SET_ALERT":
      return {
        ...state,
        msg: action.msg,
        isOpen: true,
        severity: action.severity,
      };
    case "SET_CLOSE":
      return {
        ...state,
        isOpen: false,
      };
    default:
      return state;
  }
};

export const SnackbarContext = createContext<ISnackbarContext>({
  state: {} as State,
  dispatch: () => {},
});

interface ISnackbarProvider {
  children: React.ReactNode;
}

const initialState: State = {
  severity: "success",
  msg: "",
  isOpen: false,
};

export const SnackbarProvider = ({ children }: ISnackbarProvider) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <SnackbarContext.Provider value={{ state, dispatch }}>
      {children}
    </SnackbarContext.Provider>
  );
};
