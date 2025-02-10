import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useLogInfo } from "../hooks/useLogInfo";

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
          <button
            onClick={() => refetchStatus()}
            className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition cursor-pointer"
          >
            Refresh
          </button>
          <HighchartsReact highcharts={Highcharts} options={logCountByStatusChartOptions} />
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 relative">
          <button
            onClick={() => refetchTimeSeries()}
            className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition cursor-pointer"
          >
            Refresh
          </button>
          <HighchartsReact highcharts={Highcharts} options={logTimeSeriesChartOptions} />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-700">Real-time Logs</h3>
      <div className="bg-gray-50 shadow-md border border-gray-200 rounded-lg p-4 h-64 overflow-y-auto">
        {sortedLogsHistory.length > 0 ? (
          sortedLogsHistory.map((log, index) => (
            <div key={index} className="py-2 border-b last:border-none border-gray-300 text-sm font-mono">
              <span className="text-gray-500">{log.timestamp.toLocaleString()}</span>{" "}
              <span className="font-bold" style={{ color: log.metadata?.color ?? "inherit" }}>
                {log.type}
              </span>
              : {log.message}
            </div>
          ))
        ) : (
          <div className="text-gray-500">No logs available.</div>
        )}
      </div>
    </div>
  );
};
