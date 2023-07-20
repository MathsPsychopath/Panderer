import { Dispatch, useReducer } from "react";

export type State = {
  maxParticipants: number;
  maxApproval: number;
  maxDisapproval: number;
  average: number;
  point: number;
};

type Action =
  | {
      type: "UPDATE_AVERAGE";
      nextData: number;
    }
  | {
      type: "UPDATE_MAX";
      participants: number;
      approvals: number;
      disapprovals: number;
    };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "UPDATE_AVERAGE":
      const sum = state.average * state.point + action.nextData;
      const average = sum / (state.point + 1);
      return {
        ...state,
        average,
        point: state.point + 1,
      };
    case "UPDATE_MAX":
      return {
        ...state,
        maxParticipants: Math.max(action.participants, state.maxParticipants),
        maxApproval: Math.max(action.approvals, state.maxApproval),
        maxDisapproval: Math.max(action.disapprovals, state.maxDisapproval),
      };
    default:
      return state;
  }
};

const initialState: State = {
  point: 0,
  average: 0,
  maxApproval: 0,
  maxDisapproval: 0,
  maxParticipants: 0,
};

export default function useDataAggregate(): [State, Dispatch<Action>] {
  const [state, dispatch] = useReducer(reducer, initialState);
  return [state, dispatch];
}
