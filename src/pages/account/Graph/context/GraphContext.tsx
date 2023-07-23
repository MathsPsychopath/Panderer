import { Dispatch, createContext, useReducer } from "react";

interface IGraphContext {
  state: State;
  dispatch: Dispatch<Action>;
}

type State = {
  isOpen: boolean;
  // volatile poll data
  title: string;
  // this needs to be fetch and used for public_url
  pollID: string;
};

type Action =
  | { type: "CLOSE_POLL" }
  | { type: "OPEN_POLL"; title: string; pollID: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "CLOSE_POLL":
      return initialState;
    case "OPEN_POLL":
      return {
        isOpen: true,
        title: action.title,
        pollID: action.pollID,
      };
    default:
      return state;
  }
};

export const GraphContext = createContext<IGraphContext>({
  state: {} as State,
  dispatch: () => {},
});

interface IGraphProvider {
  children: React.ReactNode;
}

const initialState: State = {
  isOpen: false,
  title: "",
  pollID: "",
};

export type FetchedState = Omit<State, "isOpen">;

export const GraphProvider = ({ children }: IGraphProvider) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <GraphContext.Provider value={{ state, dispatch }}>
      {children}
    </GraphContext.Provider>
  );
};
