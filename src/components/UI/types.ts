
export type AlignTypes = "inherit" | "left" | "center" | "right" | "justify";
export type TableRowDataType<DataEl> = {
    header: string;
    val: (el: DataEl) => string;
    align?: AlignTypes;
}

export interface ITableProps<Data> {
    data: Data[];
    index: keyof Data;
    rowData: TableRowDataType<Data>[];
    actions?: (el: Data) => JSX.Element
    noDataTitle?: string;
    isLoading?: boolean;
}