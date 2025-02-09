import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Hello } from './Hello';
import { Info } from './Info';

const queryClient = new QueryClient();

export const App = () => (
  <div>
    <QueryClientProvider client={queryClient}>
      <Hello />
      <Info />
    </QueryClientProvider> 
  </div>
);
