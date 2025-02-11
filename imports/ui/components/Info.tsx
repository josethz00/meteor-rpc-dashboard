import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useLogInfo } from "../hooks/useLogInfo";
import { LogBox } from "./LogBox";
import { RefreshButton } from "./RefreshButton";

export const Info = () => {
  const {
    isLoading,
    sortedLogsHistory,
    logCountByStatusChartOptions,
    logTimeSeriesChartOptions,
    refetchStatus,
    refetchTimeSeries,
  } = useLogInfo();

  if (isLoading) {
    return <div className="text-center py-10 text-lg font-semibold text-gray-600">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Log Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-4 relative cursor-pointer">
          <RefreshButton refetchChart={refetchStatus} />
          <HighchartsReact highcharts={Highcharts} options={logCountByStatusChartOptions} />
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 relative">
          <RefreshButton refetchChart={refetchTimeSeries} />
          <HighchartsReact highcharts={Highcharts} options={logTimeSeriesChartOptions} />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-700">Real-time Logs</h3>
      <LogBox logs={sortedLogsHistory} />
    </div>
  );
};
