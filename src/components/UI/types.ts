import React from "react";
import {IOrder} from "../../types/types";

export type AlignTypes = "inherit" | "left" | "center" | "right" | "justify";
export type TableRowDataType<DataEl> = {
    header: string;
    orderId?: keyof DataEl | string;
    val: (el: DataEl, idx: number) => string | JSX.Element | undefined | null;
    align?: AlignTypes;
    width?: number,
}

export type TableRowDataTypeResp<DataEl> = TableRowDataType<DataEl> & {
    xsHidden?: boolean;
}

export interface ITableProps<Data> {
    smallHeaderFont?: boolean;
    compact?: boolean;
    order?: keyof Data | string;
    onSort?: (order: IOrder<Data>) => () => void;
    isAscending?: boolean;
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
    viewMode?: boolean;
    hideHeader?: boolean;
}