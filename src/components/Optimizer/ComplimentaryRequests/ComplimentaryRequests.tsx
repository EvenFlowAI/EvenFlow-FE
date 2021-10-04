import React from 'react';
import {TableRowDataType} from "../../UI/types";
import {Table} from "../../UI/Table";
import {IComplimentaryService} from "../../../api/types";

type TComplimentaryRequestsProps = {
    data: IComplimentaryService[] | [];
}

const RowData: TableRowDataType<IComplimentaryService>[] = [
    {val: (el: IComplimentaryService) => el.name, header: "Included in Package", width: 500},
    {val: (el: IComplimentaryService) => `${el.durationInHours}`, header: "Labour Hours"},
    {val: (el: IComplimentaryService) => `${el.price}`, header: "Total"},
];

const ComplimentaryRequests:  React.FC<TComplimentaryRequestsProps> = ({ data }) => {
    return (
        <Table<IComplimentaryService>
            data={data}
            hideHeader
            index="id"
            rowData={RowData}
            hidePagination
        />
    );
};

export default ComplimentaryRequests;