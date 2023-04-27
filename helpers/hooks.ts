import { useEffect, useState } from 'react';

export function useLocalStorageState<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] {
  const [state, setState] = useState<T>(defaultValue);
  useEffect(() => {
    const value = localStorage.getItem(key);
    if (value) {
      setState(JSON.parse(value));
    }
  }, []);

  const setStateAndSave = (value: T) => {
    localStorage.setItem(key, JSON.stringify(value));
    setState(value);
  };

  return [state, setStateAndSave];
}
