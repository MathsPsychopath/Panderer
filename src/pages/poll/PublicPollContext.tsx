import { Dispatch, createContext, useReducer } from "react";
import { TUsableData } from "../account/Graph/ManagePoll/ManagePoll";
import { TPollMetadata } from "./PublicPoll";

type PollWithUser = TPollMetadata & { userID: string };

type Metadata = Omit<PollWithUser, "pollID">;

type BaseState = {
  isLoading: boolean;
  net: number;
};

type InvalidState = BaseState & {
  isValid: false;
};

type ValidState = BaseState & {
  isValid: true;
  metadata: Metadata;
  pollData: TUsableData | null;
};

type State = InvalidState | ValidState;

type Action =
  | {
      type: "SET_INVALID";
    }
  | {
      type: "SET_VALID";
      data: Metadata;
    }
  | {
      type: "SET_LATEST_DATA";
      data: TUsableData;
    };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_INVALID":
      return {
        ...state,
        isLoading: false,
        isValid: false,
      };
    case "SET_VALID":
      return {
        ...state,
        metadata: action.data,
        isValid: true,
        isLoading: false,
        pollData: null,
      };
    // Caller should set the metadata before updating with streamed data
    case "SET_LATEST_DATA":
      if (state.isValid && !state.metadata)
        throw Error("Metadata not defined before setting poll data");
      const { approvers, disapprovers } = action.data;
      return {
        ...(state as ValidState),
        pollData: action.data,
        isLoading: false,
        net: approvers - disapprovers,
      };
    default:
      return state;
  }
};

const initialState: State = {
  isLoading: true,
  net: 0,
  isValid: false,
};

interface IPublicContext {
  state: State;
  dispatch: Dispatch<Action>;
}

export const PublicPollContext = createContext<IPublicContext>({
  state: initialState,
  dispatch: () => {},
});

export function PublicPollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <PublicPollContext.Provider value={{ state, dispatch }}>
      {children}
    </PublicPollContext.Provider>
  );
}
