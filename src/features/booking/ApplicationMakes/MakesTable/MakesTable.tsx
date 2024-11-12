import React from 'react';
import {TableRowDataType} from "../../../../types/types";

type TProps = {
    isEdit: boolean;
}

interface IVinMake {
    make: string;
    model: string;
    count: number;
    percentOfTotal: number;
    reviewStatus: any;
    override?: any;
    evenflowModel?: any;
}

const MakesTable: React.FC<TProps> = ({isEdit}) => {
    const RowData: TableRowDataType<IVinMake>[] = [
        {
            header: "VIN Make",
            val: el => el.make,
            orderId: "VinName",
            align: "left",
        },
        {
            header: "Count",
            val: el => el.count.toString(),
            orderId: "count",
            align: "left",
        }
    ]
    return (
        <div>

        </div>
    );
};

export default MakesTable;