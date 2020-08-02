export type TableRowDataType<DataEl> = {
    header: string;
    val: (el: DataEl) => string;

}

export interface ITableProps<Data> {
    data: Data[];
    index: keyof Data;
    rowData: TableRowDataType<Data>[];
    actions?: (el: Data) => JSX.Element
}