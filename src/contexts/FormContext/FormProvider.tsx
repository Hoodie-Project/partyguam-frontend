'use client';

import { type ReactNode, useState } from 'react';

import type { FormContextType, FormType } from './FormContext';
import { FormContext } from './FormContext';

export default function FormContextProvider({ children }: { children: ReactNode }) {
  const [isFormDirty, setFormDirty] = useState(false);
  const [formType, setFormType] = useState<FormType>('');

  const contextValue: FormContextType = {
    isFormDirty,
    setFormDirty,
    formType,
    setFormType,
  };

  return <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>;
}
