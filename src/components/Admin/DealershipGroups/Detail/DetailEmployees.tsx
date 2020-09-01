import React from "react";
import {TDetailComponentProps} from "./types";
import {IEmployee} from "../../../../store/reducers/employees/types";
import {IPagingResponse} from "../../../../types/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {Table} from "../../../UI/Table";
import {TableRowDataType} from "../../../UI/types";
import {concatAddress} from "../../../../utils/utils";


const rowData: TableRowDataType<IEmployee>[] = [
    {header: "Name", val: v => v.fullName},
    {header: "Role", val: v => v.role},
    {header: "Name", val: v => v.serviceCenter?.name},
    {header: "Service center address", val: v => concatAddress(v.serviceCenter?.address)}
];

export const DetailEmployees: React.FC<TDetailComponentProps> = (props) => {
    const [employees, employeesLoading, employeesPaging]: [IEmployee[], boolean, IPagingResponse] = useSelector((state: RootState) => [
        state.employees.dealershipEmployeesList,
        state.employees.loadingDealership,
        state.employees.dealershipPaging,
    ]);
    return <Table<IEmployee>
        data={employees}
        index={"id"}
        isLoading={employeesLoading}
        changePageCb={props.onChangePage}
        changeRowsPerPageCb={props.onChangeRowsPerPage}
        count={employeesPaging.numberOfRecords}
        rowData={rowData}
    />
}