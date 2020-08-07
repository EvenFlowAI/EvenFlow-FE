export function PromiseTimeout<T> (val: T, timeout=2000): Promise<T> {
    return new Promise(resolve => {
            setTimeout(() => resolve(val), timeout);
        }
    );
}

export const getInitials = (name: string) => {
    const data = name.split(' ').slice(0, 2);
    return data.map(l => l[0].toUpperCase()).join('');
}