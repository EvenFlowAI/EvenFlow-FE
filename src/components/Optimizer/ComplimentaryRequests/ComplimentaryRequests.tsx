import React from 'react';
import {TableRowDataType} from "../../UI/types";
import {Table} from "../../UI/Table";
import {TExtendedComplimentary} from "../../../api/types";

type TComplimentaryRequestsProps = {
    data: TExtendedComplimentary[] | [];
}

const RowData: TableRowDataType<TExtendedComplimentary>[] = [
    {val: (el: TExtendedComplimentary) => el.name, header: "Included in Package"},
    {val: (el: TExtendedComplimentary) => `${el.durationInHours}`, header: "Labor Hours", width: 110, align: 'center'},
    {val: (el: TExtendedComplimentary) => `$${el.laborAmount}`, header: "Labor Amount", width: 110, align: 'center'},
    {val: (el: TExtendedComplimentary) => `$${el.partsAmount}`, header: "Parts Amount", width: 110, align: 'center'},
    {val: (el: TExtendedComplimentary) => `$${el.price}`, header: "Total", width: 110, align: 'center'},
];

const ComplimentaryRequests:  React.FC<TComplimentaryRequestsProps> = ({ data }) => {
    return (
        <Table<TExtendedComplimentary>
            data={data}
            hideHeader
            index="id"
            noDataTitle="No Complimentary Chosen"
            rowData={RowData}
            hidePagination
        />
    );
};

export default ComplimentaryRequests;