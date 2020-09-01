import React from "react";

export type TDetailComponentProps = {
    onChangePage: (e: React.MouseEvent<Element, MouseEvent> | null, pageIndex: number) => void;
    onChangeRowsPerPage: (e: React.ChangeEvent<HTMLInputElement>) => void;
    page: number;
    rowsPerPage: number
}