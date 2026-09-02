export function success<T>(data: T) {
  return JSON.stringify({
    ok: true,
    data,
  });
}

export function failure(
  code: string,
  message: string,
) {
  return JSON.stringify({
    ok: false,
    error: {
      code,
      message,
    },
  });
}