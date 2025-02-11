import React from 'react';
import { ILog } from '/imports/api/logs';


interface LogBoxProps {
  logs: ILog[];
}

export const LogBox = ({ logs }: LogBoxProps) => {
  return (
    <div className="bg-gray-50 shadow-md border border-gray-200 rounded-lg p-4 h-64 overflow-y-auto">
      {logs.length > 0 ? (
        logs.map((log, index) => (
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
  );
};
