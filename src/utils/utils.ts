export function PromiseTimeout<T> (val: T, timeout=2000): Promise<T> {
    return new Promise(resolve => {
            setTimeout(() => resolve(val), timeout);
        }
    );
}