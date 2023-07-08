// this is for the learn more button on landing page
import React from "react";
import LoadingBar from "react-top-loading-bar";

export default function TopLoadingBar({
  progress,
  setProgress,
}: {
  progress: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <LoadingBar
      color="#2f2074"
      progress={progress}
      onLoaderFinished={() => setProgress(0)}
    />
  );
}
