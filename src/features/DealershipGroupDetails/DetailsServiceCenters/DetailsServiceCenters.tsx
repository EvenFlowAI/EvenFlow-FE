import React from "react";
import {Table} from "../../../components/UI/Table";
import {TableRowDataType} from "../../../components/UI/types";
import {IServiceCenterExtended} from "../../../store/reducers/serviceCenters/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {concatAddress} from "../../../utils/utils";
import {TDetailComponentProps} from "../../../pages/admin/DealerShipGroupDetails/types";

const rowData: TableRowDataType<IServiceCenterExtended>[] = [
    {header: "Name", val: v => v.name},
    {header: "Address", val: v => concatAddress(v.address)},
    {header: "Employees", val: v => String(v.countOfEmployees), align: "center"},
    {header: "Bays", val: v => String(v.countOfBays) || '-', align: "center"}
];

export const DetailsServiceCenters: React.FC<TDetailComponentProps> = (props) => {
    const [data, size, loading] = useSelector((state: RootState) => [
        state.serviceCenters.dealershipSCs,
        state.serviceCenters.dealershipPaging.numberOfRecords,
        state.serviceCenters.dealershipLoading
    ]);
    return <Table<IServiceCenterExtended>
        data={data}
        index={"id"}
        isLoading={loading}
        rowData={rowData}
        onChangePage={props.onChangePage}
        onChangeRowsPerPage={props.onChangeRowsPerPage}
        page={props.page}
        count={size}
        rowsPerPage={props.rowsPerPage}
    />
}