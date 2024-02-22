export type TSortColumns = "Role"| "ServiceBook" | "Name"

export type TOrder = {
    orderBy: TSortColumns,
    isAscending: boolean;
}