import { ISeriesApi, UTCTimestamp } from "lightweight-charts";
import { Dispatch, MutableRefObject, useCallback, useReducer } from "react";

// returns localised seconds
export const getLocalizedTime = (s: number) => {
  const d = new Date(s * 1000);
  return (
    Date.UTC(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes(),
      d.getSeconds(),
      d.getMilliseconds()
    ) / 1000
  );
};

// time will be in milliseconds
export type TCandle = {
  time: UTCTimestamp;
  open: number; // this is the invariant number
  high: number;
  low: number;
  close: number;
};

export type TCandlestickRef =
  MutableRefObject<ISeriesApi<"Candlestick"> | null>;

// oneMinuteHistory is all candles that have been commited and will not change
type State = {
  oneMinuteHistory: TCandle[];
  currentCandle: TCandle;
};

type Action =
  | {
      type: "COMMIT_CANDLE";
    }
  | {
      type: "UPDATE_CURRENT";
      net: number;
    }
  | {
      type: "UNDEFINED_DATA";
    };

const commitCandle = (state: State): State => {
  const { close, time } = state.currentCandle;
  return {
    ...state,
    oneMinuteHistory: [...state.oneMinuteHistory, state.currentCandle],
    currentCandle: {
      time: (time.valueOf() + 60) as UTCTimestamp,
      open: close,
      high: close,
      low: close,
      close: close,
    },
  };
};

const updateCandle = (state: State, net: number): State => {
  const { high: prevHigh, low: prevLow } = state.currentCandle;
  const newClose = net;
  let newHigh = Math.max(net, prevHigh);
  let newLow = Math.min(net, prevLow);
  return {
    ...state,
    currentCandle: {
      ...state.currentCandle,
      high: newHigh,
      low: newLow,
      close: newClose,
    },
  };
};

const initialState: State = {
  oneMinuteHistory: [
    {
      time: getLocalizedTime(Date.now() / 1000) as UTCTimestamp,
      open: 0,
      high: 0,
      low: 0,
      close: 0,
    },
  ],
  currentCandle: {
    time: getLocalizedTime(Date.now() / 1000) as UTCTimestamp,
    open: 0,
    high: 0,
    low: 0,
    close: 0,
  },
};

export default function useCandlesticks(
  candlestickRef: TCandlestickRef
): [State, Dispatch<Action>] {
  const reducer = useCallback((state: State, action: Action): State => {
    switch (action.type) {
      // adds to history and starts next candle
      // should compare minutes before usage
      case "COMMIT_CANDLE":
        const committedState = commitCandle(state);
        candlestickRef.current?.update(committedState.currentCandle);
        return committedState;
      // update the current candle given the movement
      // optimal if batched movement
      case "UPDATE_CURRENT":
        const nextState = updateCandle(state, action.net);
        candlestickRef.current?.update(nextState.currentCandle);
        return nextState;
      case "UNDEFINED_DATA":
        return state;
      default:
        return state;
    }
  }, []);
  const [state, dispatch] = useReducer(reducer, initialState);
  return [state, dispatch];
}
