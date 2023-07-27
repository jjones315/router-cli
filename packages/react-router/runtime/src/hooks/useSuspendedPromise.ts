type CachedItem = {
  promise: Promise<unknown>
  key: string
  error?: any
  response?: unknown
  timeout?: ReturnType<typeof setTimeout>
  remove: () => void
}

const isPromise = (promise: any): promise is Promise<unknown> =>
  typeof promise === 'object' && typeof (promise as Promise<any>).then === 'function'

const _cache: Map<string, CachedItem> = new Map();

type PromiseOrFunc<TData> = (() => Promise<TData>) | Promise<TData>;


function query<TData>({ func, key, preload }: {
  func: PromiseOrFunc<TData>,
  key: string,
  preload?: boolean
}) {

  const cachedEntry = _cache.get(key);

  if (cachedEntry) {
    if ("error" in cachedEntry && cachedEntry.error) throw cachedEntry.error;
    if ("response" in cachedEntry) return cachedEntry.response as TData;
    if (!preload) throw cachedEntry.promise
  }

  const entry: CachedItem = {
    key,
    remove: () => _cache.delete(key),
    promise:
      (isPromise(func) ? func : func())
        .then((response) => {
          entry.response = response;
          return response;
        })
        .catch((error) => (entry.error = error)),
  }

  _cache.set(key, entry);
  if (!preload) throw entry.promise
  return undefined as unknown as TData;
}

export const useSuspendedPromise = <TData>(
  func: PromiseOrFunc<TData>,
  key: string,
) => query({ func, key, preload: false });

export const suspendedPromiseCache = {
  preload: <TData>(
    func: PromiseOrFunc<TData>,
    key: string,
  ) => {
    query({ func, key, preload: true });
  },
  preloadValue: <TData>(
    value: TData,
    key: string,
  ) => {
    const entry = {
      key,
      response: value,
      remove: () => _cache.delete(key),
      promise: Promise.resolve(value),
    };

    _cache.set(key, entry);
    return entry;
  },
  clear: (key: string) => _cache.delete(key),
}