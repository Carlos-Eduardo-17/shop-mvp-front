import { isAxiosError } from 'axios';

// Reemplaza el patrón repetido `catch (err: any) { err?.response?.data?.message }`
// por algo tipado. isAxiosError() de axios ya hace de type guard, así que no
// hace falta 'any' en ningún catch que use este helper.
export const getErrorMessage = (err: unknown, fallback: string): string => {
  if (isAxiosError<{ message?: string }>(err)) {
    return err.response?.data?.message ?? fallback;
  }
  return fallback;
};
