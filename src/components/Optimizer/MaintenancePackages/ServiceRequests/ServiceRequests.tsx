import React from 'react';
import {TableRowDataType} from "../../../UI/types";
import {Table} from "../../../UI/Table";

export type TServiceRequestShort = {
    id: number;
    code: string;
    description: string;
    durationInHours?: number;
    price?: number;
}

type TServiceRequestsProps = {
    data: TServiceRequestShort[] | [];
}

const RowData: TableRowDataType<TServiceRequestShort>[] = [
    {val: (el: TServiceRequestShort) => el.description, header: "Included in Package", width: 500},
    {val: (el: TServiceRequestShort) => `${el.durationInHours}`, header: "Labour Hours"},
    {val: (el: TServiceRequestShort) => `${el.price}`, header: "Total"},
];

export const ServiceRequests: React.FC<TServiceRequestsProps> = ({ data }) => {
    return <Table<TServiceRequestShort>
        data={data}
        index="id"
        rowData={RowData}
        hidePagination
    />
}