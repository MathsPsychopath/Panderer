import { NavigateFunction } from "react-router-dom";
import { Action } from "../../../../components/context/SnackbarContext";

export function ago(since: Date) {
  const seconds = Math.floor((Date.now() - since.getTime()) / 1000);

  if (seconds < 60) {
    return `${seconds} s ago`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    const remainingSeconds = seconds % 60;
    return `${minutes} m ${remainingSeconds} s ago`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} hr ${remainingMinutes} m ago`;
}

export function copyClipboard(
  pollID: string,
  navigate: NavigateFunction,
  dispatch: (a: Action) => void
) {
  return async function () {
    try {
      await navigator.clipboard.writeText(
        "https://panderer-fef7a.web.app/poll/" + pollID
      );
      dispatch({
        type: "SET_ALERT",
        severity: "success",
        msg: "Link copied to clipboard!",
      });
    } catch {
      dispatch({
        type: "SET_ALERT",
        severity: "error",
        msg: "Could not copy link. Navigating to public page...",
      });
      setTimeout(() => {
        navigate("/poll/" + pollID);
      }, 3000);
    }
  };
}
