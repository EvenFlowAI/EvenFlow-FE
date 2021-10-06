import React from 'react';
import {TableRowDataType} from "../../UI/types";
import {Table} from "../../UI/Table";
import {TExtendedComplimentary} from "../../../api/types";

type TComplimentaryRequestsProps = {
    data: TExtendedComplimentary[] | [];
}

const RowData: TableRowDataType<TExtendedComplimentary>[] = [
    {val: (el: TExtendedComplimentary) => el.name, header: "Included in Package"},
    {val: (el: TExtendedComplimentary) => `${el.durationInHours}`, header: "Labour Hours", width: 100, align: 'center'},
    {val: (el: TExtendedComplimentary) => `$${el.laborAmount}`, header: "Labour Amount", width: 100, align: 'center'},
    {val: (el: TExtendedComplimentary) => `$${el.partsAmount}`, header: "Parts Amount", width: 100, align: 'center'},
    {val: (el: TExtendedComplimentary) => `$${el.price}`, header: "Total", width: 100, align: 'center'},
];

const ComplimentaryRequests:  React.FC<TComplimentaryRequestsProps> = ({ data }) => {
    return (
        <Table<TExtendedComplimentary>
            data={data}
            hideHeader
            index="id"
            rowData={RowData}
            hidePagination
        />
    );
};

export default ComplimentaryRequests;