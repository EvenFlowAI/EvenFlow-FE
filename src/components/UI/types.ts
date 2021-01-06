import React from "react";

export type AlignTypes = "inherit" | "left" | "center" | "right" | "justify";
export type TableRowDataType<DataEl> = {
    header: string;
    val: (el: DataEl, idx: number) => string | JSX.Element | undefined | null;
    align?: AlignTypes;
}

export type TableRowDataTypeResp<DataEl> = TableRowDataType<DataEl> & {
    xsHidden?: boolean;
}

export interface ITableProps<Data> {
    compact?: boolean;
    hidePagination?: boolean;
    data: Data[];
    index: keyof Data;
    rowData: TableRowDataTypeResp<Data>[];
    onChangePage?: (e: React.MouseEvent<Element, MouseEvent> | null, page: number) => void;
    changePageCb?: (page: number, pageSize: number) => void;
    changeRowsPerPageCb?: (rowsPerPage: number) => void;
    onChangeRowsPerPage?: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
    page?: number;
    count?: number;
    rowsPerPage?: number;
    startActions?: (el: Data) => JSX.Element;
    actions?: (el: Data) => JSX.Element;
    noDataTitle?: string;
    isLoading?: boolean;
}