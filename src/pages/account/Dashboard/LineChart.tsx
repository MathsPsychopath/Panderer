import { Box } from "@mui/material";
import { IChartApi, UTCTimestamp, createChart } from "lightweight-charts";
import { useEffect, useRef } from "react";

type Data = {
  time: UTCTimestamp;
  value: number;
};

interface IBarChart {
  data: Data[];
  id: string;
}

export default function LineChart({ data, id }: IBarChart) {
  const chart = useRef<IChartApi | null>();
  // mount barchart
  useEffect(() => {
    chart.current = createChart(document.getElementById("chart-" + id)!, {
      autoSize: true,
    });
    const barchart = chart.current.addLineSeries();
    barchart.setData(data);
    return () => {
      chart.current?.remove();
    };
  });
  return <Box className="h-4/5 w-full" id={`chart-${id}`} />;
}
