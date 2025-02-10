import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Header } from './components/Header';
import { Info } from './components/Info';

const queryClient = new QueryClient();

export const App = () => (
  <div>
    <QueryClientProvider client={queryClient}>
      <Header />
      <Info />
    </QueryClientProvider> 
  </div>
);
