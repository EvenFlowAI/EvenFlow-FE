export type TZipCode = {
    code: string;
    id: number;
}

export type TZone = {
    name: string;
    id: number;
    zipCodes: TZipCode[];
}