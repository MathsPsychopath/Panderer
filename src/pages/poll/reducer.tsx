import { Dispatch, useReducer } from "react";
import { TUsableData } from "../account/Graph/ManagePoll/ManagePoll";
import { TPollMetadata } from "./PublicPoll";

type PollWithUser = TPollMetadata & { userID: string };

type Metadata = Omit<PollWithUser, "pollID">;

type BaseState = {
  isLoading: boolean;
  net: number;
};

type State = BaseState &
  (
    | { isValid: false }
    | {
        isValid: true;
        metadata: Metadata;
        pollData?: TUsableData;
      }
  );

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
        pollData: undefined,
      };
    // Caller should set the metadata before updating with streamed data
    case "SET_LATEST_DATA":
      if (state.isValid && !state.metadata)
        throw Error("Metadata not defined before setting poll data");
      const { approvers, disapprovers } = action.data;
      return {
        ...state,
        pollData: action.data,
        isValid: true,
        isLoading: false,
        net: approvers - disapprovers,
      } as State & { metadata: Metadata };
    default:
      return state;
  }
};

const initialState: State = {
  isLoading: true,
  net: 0,
  isValid: false,
};

export default function usePoll(): [State, Dispatch<Action>] {
  const [state, dispatch] = useReducer(reducer, initialState);
  return [state, dispatch];
}
