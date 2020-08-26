import React from "react";

export type AlignTypes = "inherit" | "left" | "center" | "right" | "justify";
export type TableRowDataType<DataEl> = {
    header: string;
    val: (el: DataEl) => string | JSX.Element | undefined | null;
    align?: AlignTypes;
}

export interface ITableProps<Data> {
    compact?: boolean;
    hidePagination?: boolean;
    data: Data[];
    index: keyof Data;
    rowData: TableRowDataType<Data>[];
    onChangePage?: (e: React.MouseEvent<Element, MouseEvent> | null, page: number) => void;
    onChangeRowsPerPage?: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
    page?: number;
    count?: number;
    rowsPerPage?: number;
    startActions?: (el: Data) => JSX.Element;
    actions?: (el: Data) => JSX.Element;
    noDataTitle?: string;
    isLoading?: boolean;
}