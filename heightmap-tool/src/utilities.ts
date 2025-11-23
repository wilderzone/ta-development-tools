import type { Ref } from 'vue';

/**
 * Wrap a promise or async function in a signal, such that the signal is `true` while
 * the promise is in-progress, and `false` once the promise has been resolved (or rejected).
 * 
 * @param target The promise or async function.
 * @param ref The signal ref.
 * @returns The result of the async function.
 */
export async function asyncRef<T>(target: Promise<T>, ref: Ref<boolean>): Promise<T>;
export async function asyncRef<T>(target: () => Promise<T>, ref: Ref<boolean>): Promise<T>;
export async function asyncRef<T>(target: Promise<T> | (() => Promise<T>), ref: Ref<boolean>): Promise<T> {
	ref.value = true;
	try {
		const output = typeof target === 'function'
			? await target()
			: await target;
		return output;
	} catch (error) {
		throw error;
	} finally {
		ref.value = false;
	}
}
