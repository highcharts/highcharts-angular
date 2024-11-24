import { signal } from '@angular/core';

export function promiseToSignal<T>(promise: Promise<T>) {
  const value = signal<T | null>(null);
  const error = signal<any>(null);
  const isLoading = signal(true);

  promise
    .then((result) => {
      value.set(result);
      error.set(null);
    })
    .catch((err) => {
      value.set(null);
      error.set(err);
    })
    .finally(() => {
      isLoading.set(false);
    });

  return value.asReadonly();
}


