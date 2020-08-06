export type LinkType = {
    to: string;
    name: string;
}

export type ValidationKeyPairs<U> = {
    field: keyof U;
    message: string;
}