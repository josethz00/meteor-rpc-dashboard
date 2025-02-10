import React, { Fragment } from 'react';
import { useLogGenerator } from '../hooks/useLogGenerator';

export const Header = () => {
  const { logTypes, handleLogGeneration } = useLogGenerator();

  return (
    <Fragment>
      <h1 className='font-bold text-3xl p-6'>METEOR-RPC DASHBOARD</h1>
      <div className="flex items-center gap-4 pl-6">
        {logTypes.map(({ type, label, color }) => (
          <button
            key={type}
            onClick={() => handleLogGeneration(type)}
            className={`${color} text-white font-semibold px-4 py-2 rounded-md shadow-md hover:opacity-80 transition cursor-pointer`}
            aria-label={`Log ${label}`}
          >
            {label}
          </button>
        ))}
      </div>
    </Fragment>
  );
};
