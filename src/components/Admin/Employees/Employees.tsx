import React, {useEffect, useMemo} from "react";
import {Table} from "../../UI/Table";
import {IconButton} from "@material-ui/core";
import {Visibility} from "@material-ui/icons";
import {TableRowDataType} from "../../UI/types";
import {TableAvatar} from "../TableAvatar";
import {IEmployee} from "../../../store/reducers/employees/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {loadAll} from "../../../store/reducers/employees/actions";
import {useCurrentUser, usePagination} from "../../../utils/hooks";
import {changePageData} from "../../../store/reducers/employees/actions";
import {concatAddress} from "../../../utils/utils";

const SURowData: TableRowDataType<IEmployee>[] = [
    {val: (el: IEmployee) => el.fullName, header: "Name"},
    {val: (el: IEmployee) => el?.dealership?.name, header: "Dealership group"},
    {val: (el: IEmployee) => el?.dealership?.mainAddress, header: "Service center address"},
    {val: (el: IEmployee) => el.role, header: "Role"},
];

const AdminRowData: TableRowDataType<IEmployee>[] = [
    {val: el => el.fullName, header: "Name"},
    {val: el => el.serviceCenter?.name || '-', header: "Service Center"},
    {val: el => el.serviceCenter?.address ? concatAddress(el.serviceCenter.address) : '-', header: "Service center Address"},
    {val: el => el.role, header: "Role"},
    {val: el => el.phoneNumber, header: "Phone Number"}
];


export const Employees = () => {
    const {data, isLoading, count} = useSelector((state: RootState) => ({
        data: state.employees.employeesList,
        isLoading: state.employees.loading,
        count: state.employees.paging.numberOfRecords
    }));
    const {changeRowsPerPage,changePage,pageIndex,pageSize} = usePagination(
        (s: RootState) => s.employees.pageData,
        changePageData
    );
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadAll());
    }, [dispatch]);
    const currentUser = useCurrentUser();

    const rowData = useMemo<TableRowDataType<IEmployee>[]>(() => {
        return currentUser?.isSuperUser ? SURowData : AdminRowData;
    }, [currentUser]);

    const handleView = (el: IEmployee) => () => alert(`View ${el.fullName}`);
    const viewActions = (el: IEmployee) => (
        <IconButton size="small" onClick={handleView(el)}><Visibility /></IconButton>
    );
    const startActions = (el: IEmployee) => (
        <TableAvatar name={el.fullName} />
    )

    return <Table<IEmployee>
        data={data}
        noDataTitle="No employees present"
        isLoading={isLoading}
        rowData={rowData}
        onChangePage={changePage}
        onChangeRowsPerPage={changeRowsPerPage}
        count={count}
        page={pageIndex}
        rowsPerPage={pageSize}
        startActions={startActions}
        index="id"
        actions={viewActions}
    />
}