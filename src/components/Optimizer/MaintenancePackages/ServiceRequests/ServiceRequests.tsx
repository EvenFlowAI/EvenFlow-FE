import React from 'react';
import {TableRowDataType} from "../../../UI/types";
import {Table} from "../../../UI/Table";
import {TExtendedService} from "../../../../api/types";

type TServiceRequestsProps = {
    data: TExtendedService[] | [];
}

const RowData: TableRowDataType<TExtendedService>[] = [
    {val: (el: TExtendedService) => el.description, header: "Included in Package"},
    {val: (el: TExtendedService) => `${el.durationInHours}`, header: "Labour Hours", width: 100, align: 'center'},
    {val: (el: TExtendedService) => `$${el.laborAmount}`, header: "Labour Amount", width: 100, align: 'center'},
    {val: (el: TExtendedService) => `$${el.partsAmount}`, header: "Parts Amount", width: 100, align: 'center'},
    {val: (el: TExtendedService) => `$${el.price}`, header: "Total",  width: 100, align: 'center'},
];

export const ServiceRequests: React.FC<TServiceRequestsProps> = ({ data }) => {
    return <Table<TExtendedService>
        data={data}
        index="id"
        rowData={RowData}
        hidePagination
    />
}