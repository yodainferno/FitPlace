type LoadingType = { state: 'loading' };
type ErrorType = { state: 'error' };
type SuccessType<T> = { state: 'success'; data: T };

export type LoadState<T> = LoadingType | ErrorType | SuccessType<T>;

export const LoadingState: LoadingType = { state: 'loading' };
export const ErrorState: ErrorType = { state: 'error' };

export function createSuccessState<T>(data: T): SuccessType<T> {
  return { state: 'success', data };
}
