export const isRejected = (input: PromiseSettledResult<unknown>): input is PromiseRejectedResult =>
	input.status === "rejected";

export const isFulfilled = <T>(
	input: PromiseSettledResult<T>
): input is PromiseFulfilledResult<T> => input.status === "fulfilled";

export const isOfType = <T>(item: T | undefined): item is T => !!item;

export type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<T>;

export type MakeRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
