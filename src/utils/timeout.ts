export const timeout = (ms = 500): Promise<unknown> =>
  new Promise((resolve) => setTimeout(resolve, ms));
