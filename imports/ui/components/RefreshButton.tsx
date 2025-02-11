import React from 'react';

interface RefreshButtonProps {
  refetchChart: () => void;
}

export const RefreshButton = ({ refetchChart }: RefreshButtonProps) => (
  <button
    onClick={() => refetchChart()}
    className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition cursor-pointer"
  >
    Refresh
  </button>
)
