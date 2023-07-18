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
} | null;

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
      time: UTCTimestamp;
    }
  | {
      type: "UNDEFINED_DATA";
    };

// this will move onto the next minute candle, adding current candle to history
const commitCandle = (state: State, time: UTCTimestamp): State => {
  const { close } = state.currentCandle!;
  return {
    ...state,
    oneMinuteHistory: [...state.oneMinuteHistory, state.currentCandle],
    currentCandle: {
      time: (Math.floor(time.valueOf() / 60) * 60) as UTCTimestamp,
      open: close,
      high: close,
      low: close,
      close: close,
    },
  };
};

// this updates the current candle with tick
const updateCandle = (state: State, net: number, time: UTCTimestamp): State => {
  if (!state.currentCandle) {
    // create the first candle and commit the last know candle
    const firstCandle = {
      time: (Math.floor(time.valueOf() / 60) * 60) as UTCTimestamp,
      close: net,
      high: net < 0 ? 0 : net,
      low: net < 0 ? net : 0,
      open: 0,
    };
    return {
      oneMinuteHistory: [firstCandle],
      currentCandle: {
        time: getLocalizedTime(Math.floor(Date.now() / 1000)) as UTCTimestamp,
        open: net,
        close: net,
        high: net,
        low: net,
      },
    };
  }
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
  oneMinuteHistory: [],
  currentCandle: null,
};

export default function useCandlesticks(
  candlestickRef: TCandlestickRef
): [State, Dispatch<Action>] {
  const reducer = useCallback((state: State, action: Action): State => {
    switch (action.type) {
      // adds to history and starts next candle
      case "COMMIT_CANDLE":
        if (!state.currentCandle) return initialState;
        const committedState = commitCandle(
          state,
          getLocalizedTime(Math.floor(Date.now() / 1000)) as UTCTimestamp
        );
        candlestickRef.current?.update(committedState.currentCandle!);
        return committedState;
      // update the current candle given the movement
      // optimal if batched movement
      case "UPDATE_CURRENT":
        const nextState = updateCandle(state, action.net, action.time);
        if (state.currentCandle) {
          candlestickRef.current?.update(nextState.currentCandle!);
          return nextState;
        }
        // this is the first candle, so set the current state incl. history
        const lastRecordedCandle = nextState.oneMinuteHistory[0]!;
        candlestickRef.current?.setData([
          lastRecordedCandle,
          nextState.currentCandle!,
        ]);
        candlestickRef.current?.setMarkers([
          {
            time: lastRecordedCandle.time,
            position: "aboveBar",
            color: "#2f2074",
            shape: "arrowDown",
            text: "Previous value",
          },
        ]);
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
