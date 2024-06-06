import { createContext, useContext } from 'react';

export type FormType = '' | '필수회원가입' | '세부프로필작성';

export interface FormContextType {
  isFormDirty: boolean;
  setFormDirty: (value: boolean) => void;
  formType: FormType;
  setFormType: (value: FormType) => void;
}

const FormContext = createContext<FormContextType | null>(null);

function useFormContext() {
  const context = useContext(FormContext);
  if (context === null) {
    throw new Error('Cannot find <FormContext>');
  }
  return context;
}

export { FormContext, useFormContext };
