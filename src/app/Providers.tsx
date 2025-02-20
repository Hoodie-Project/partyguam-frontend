'use client';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import FormContextProvider from '@/contexts/FormContext/FormProvider';
import ModalContextProvider from '@/contexts/ModalContext/ModalProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ModalContextProvider>
        <FormContextProvider>{children}</FormContextProvider>
      </ModalContextProvider>
    </QueryClientProvider>
  );
}
