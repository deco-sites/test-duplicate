export interface Params<T> {
  delay: number;
  cb: (data: T) => void;
}

export function createDebounce<T>({ delay, cb }: Params<T>) {
  let task = 0;

  function debounce(data: T) {
    clearTimeout(task);

    task = setTimeout(() => {
      cb(data);
    }, delay);
  }

  return debounce;
}
