import { rpcApiClient } from "/imports/ui/services/rpc-api-client";

export const useLogInfo = () => {
  const { data: logsHistory } = rpcApiClient.logs.logsHistory.usePublication();
  const { data: logCountByStatus, isLoading: statusLoading, refetch: refetchStatus } =
    rpcApiClient.logs.getLogCountByStatus.useQuery();
  const { data: logTimeSeries, isLoading: timeSeriesLoading, refetch: refetchTimeSeries } =
    rpcApiClient.logs.getLogTimeSeries.useQuery();

  const logCountByStatusChartData = logCountByStatus?.map((status) => ({
    name: status.type,
    y: status.count,
  }));

  const logTimeSeriesChartData = logTimeSeries?.map((entry) => ({
    x: new Date(entry.timestamp).getTime(),
    y: entry.count,
  }));

  const sortedLogsHistory = logsHistory
    ? [...logsHistory].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    : [];

  const logCountByStatusChartOptions = {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
    },
    title: {
      text: "Log Count by Status",
      style: { fontSize: "16px", fontWeight: "bold" },
    },
    plotOptions: {
      pie: {
        innerSize: "50%",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.y}",
        },
      },
    },
    series: [
      {
        name: "Logs",
        data: logCountByStatusChartData,
      },
    ],
  };

  const logTimeSeriesChartOptions = {
    chart: {
      type: "line",
      backgroundColor: "transparent",
    },
    title: {
      text: "Log Time Series (Last 10 minutes)",
      style: { fontSize: "16px", fontWeight: "bold" },
    },
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      title: {
        text: "Log Count",
      },
    },
    series: [
      {
        name: "Logs",
        data: logTimeSeriesChartData,
        color: "#007bff",
      },
    ],
  };

  return {
    isLoading: statusLoading || timeSeriesLoading,
    sortedLogsHistory,
    logCountByStatusChartOptions,
    logTimeSeriesChartOptions,
    refetchStatus,
    refetchTimeSeries,
  };
};
