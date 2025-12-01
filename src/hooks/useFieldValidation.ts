import { useState, useCallback } from 'react';

export interface ValidationRule {
  validator: (value: any) => boolean;
  message: string;
}

export interface FieldValidationResult {
  error: string | null;
  isValid: boolean;
  isTouched: boolean;
  onBlur: () => void;
  onFocus: () => void;
  reset: () => void;
}

export const useFieldValidation = (
  value: any,
  rules: ValidationRule[]
): FieldValidationResult => {
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  
  const validate = useCallback(() => {
    for (const rule of rules) {
      if (!rule.validator(value)) {
        setError(rule.message);
        return false;
      }
    }
    setError(null);
    return true;
  }, [value, rules]);
  
  const handleBlur = useCallback(() => {
    setTouched(true);
    validate();
  }, [validate]);
  
  const handleFocus = useCallback(() => {
    // Clear error on focus to give user a fresh start
    if (touched) {
      setError(null);
    }
  }, [touched]);
  
  const reset = useCallback(() => {
    setTouched(false);
    setError(null);
  }, []);
  
  return {
    error: touched ? error : null,
    isValid: !error,
    isTouched: touched,
    onBlur: handleBlur,
    onFocus: handleFocus,
    reset,
  };
};
