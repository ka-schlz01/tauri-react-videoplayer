import { useRef } from 'react';
import { Api } from '../services/api';

export function useApi(): Api {
  const ref = useRef<Api | null>(null);
  if (ref.current === null) ref.current = new Api();
  return ref.current;
}

export default useApi;
