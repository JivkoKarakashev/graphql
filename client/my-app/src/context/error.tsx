import { createContext, useCallback, useState } from 'react';

import ErrorToastContainer from '../components/ErrorToastContainer.tsx';

type ErrorType = 'danger' | 'warning' | 'info';

interface AppError {
  id: number,
  message: string,
  type: ErrorType
}

interface ErrorContextValue {
  addError: (message: string, type?: ErrorType) => void,
  clearErrors: () => void
}

const errorContextValueInit: ErrorContextValue = {
  addError: () => { },
  clearErrors: () => { }
};

const ErrorContext = createContext<ErrorContextValue>(errorContextValueInit);

let idCounter = 0;

const ErrorContextProvider = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const [errors, setErrors] = useState<AppError[]>([]);

  const addError = useCallback((message: string, type: ErrorType = 'danger') => {
    const id = ++idCounter;
    setErrors(prev => [...prev, { id, message, type }]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setErrors(prev => prev.filter(e => e.id !== id));
    }, 5000);
  }, []);

  const clearErrors = useCallback(() => setErrors([]), []);

  const dismiss = useCallback((id: number) => {
    setErrors(prev => prev.filter(e => e.id !== id));
  }, []);

  return (
    <ErrorContext.Provider value={{ addError, clearErrors }}>
      <ErrorToastContainer errors={errors} onDismiss={dismiss} />
      {children}
    </ErrorContext.Provider>
  );
};

export default ErrorContextProvider;

export {
  type ErrorType,
  type AppError,
  ErrorContext
}