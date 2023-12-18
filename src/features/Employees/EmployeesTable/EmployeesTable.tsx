import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from 'react';
import {Table} from "../../../components/UI/Table";
import {IEmployee} from "../../../store/reducers/employees/types";
import {IconButton, Menu, MenuItem} from "@material-ui/core";
import {MoreHoriz, Visibility} from "@material-ui/icons";
import {Roles} from "../../../config/constants";
import {TableAvatar} from "../../../components/UI/TableAvatar";
import {IOrder, TCallback} from "../../../types/types";
import {changePageData, loadByFilters, removeEmployee, setEmplOrder} from "../../../store/reducers/employees/actions";
import {TableRowDataType} from "../../../components/UI/types";
import {useConfirm, useCurrentUser, useException, useMessage, usePagination, useSCs} from "../../../utils/hooks";
import {RootState} from "../../../store/rootReducer";
import {useDispatch, useSelector} from "react-redux";
import {concatAddress} from "../../../utils/utils";

const SURowData: TableRowDataType<IEmployee>[] = [
    {val: (el: IEmployee) => el.fullName, header: "Name"},
    {val: (el: IEmployee) => el.dealership?.name, header: "Dealership group"},
    {val: (el: IEmployee) => concatAddress(el.dealership?.address), header: "Service center address"},
    {val: (el: IEmployee) => el.role === Roles.Technician ? `${el.role} (${el.employeeInfo?.skillLevel || 1})` : el.role, header: "Role"},
];

const AdminRowData: TableRowDataType<IEmployee>[] = [
    {val: el => el.fullName, header: "Name", orderId: "name"},
    {val: el => el.serviceCenter?.name || '-', header: "Service Center", orderId: "serviceCenterName"},
    {val: el => el.serviceCenter?.address ? concatAddress(el.serviceCenter.address) : '-', header: "Service Center Address"},
    {val: el => el.role === Roles.Technician ? `${el.role} (${el.employeeInfo?.skillLevel || 1})` : el.role, header: "Role", orderId: "role"},
    {val: el => el.phoneNumber, header: "Phone Number", orderId: "phoneNumber", width: 170}
];

type TProps = {
    editedItem: IEmployee|undefined;
    setEditedItem: Dispatch<SetStateAction<IEmployee|undefined>>;
    onOpen: TCallback;
}

const EmployeesTable:React.FC<TProps> = ({editedItem, setEditedItem, onOpen}) => {
    const [data, isLoading, count,  order, searchTerm] = useSelector((state: RootState) => [
        state.employees.employeesList,
        state.employees.loading,
        state.employees.paging.numberOfRecords,
        state.employees.order,
        state.employees.searchTerm,
    ]);
    const [anchorEl, setAnchorEl] = useState<EventTarget&HTMLButtonElement|null>(null);
    const {selectedSC} = useSCs();
    const currentUser = useCurrentUser();
    const {askConfirm} = useConfirm();
    const showError = useException();
    const showMessage = useMessage();
    const dispatch = useDispatch();

    const {changeRowsPerPage, changePage, pageIndex, pageSize} = usePagination(
        (s: RootState) => s.employees.pageData,
        changePageData
    );

    const rowData = useMemo<TableRowDataType<IEmployee>[]>(() => {
        return currentUser?.isSuperUser ? SURowData : AdminRowData;
    }, [currentUser]);

    useEffect(() => {
        selectedSC && dispatch(loadByFilters())
    }, [order, searchTerm, selectedSC])

    const handleMenuOpen = (item: IEmployee) => (e: React.MouseEvent<HTMLButtonElement>) => {
        setEditedItem(item);
        setAnchorEl(e.currentTarget);
    }
    const editEmployee = () => {
        onOpen();
        setAnchorEl(null);
    }
    const handleRemove = async () => {
        try {
            await dispatch(removeEmployee(editedItem?.id || ''))
            showMessage(`Employee removed`);
            setEditedItem(undefined);
        } catch (e) {
            showError(e);
        }
    }
    const onDeleteEmployee = () => {
        setAnchorEl(null);
        if (editedItem?.role === 'Owner') {
            showError("You cannot remove dealership account");
        } else {
            askConfirm({
                isRemove: true,
                title: `Please confirm you want to remove employee ${editedItem?.fullName}?`,
                onConfirm: handleRemove
            });
        }
    }
    const handleOrder = (order: IOrder<IEmployee>) => () => {
        dispatch(setEmplOrder(order));
    }

    const handleView = (el: IEmployee) => () => alert(`View ${el.fullName}`);

    const viewActions = (el: IEmployee) => (
        currentUser?.isSuperUser
            ? <IconButton size="small" onClick={handleView(el)}><Visibility /></IconButton>
            : <IconButton
                disabled={el.role === Roles.Owner || el.id === currentUser?.id}
                size="small"
                onClick={handleMenuOpen(el)}>
                <MoreHoriz />
            </IconButton>
    );

    const startActions = (el: IEmployee) => (
        <TableAvatar name={el.fullName} src={el?.avatarPath} />
    )

    return (
        <>
            <Table<IEmployee>
                data={data}
                order={order.orderBy}
                isAscending={order.isAscending}
                onSort={handleOrder}
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
                hidePagination={count < 11}
            />
            <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
                <MenuItem onClick={editEmployee}>Edit</MenuItem>
                <MenuItem onClick={onDeleteEmployee}>Delete</MenuItem>
            </Menu>
        </>
    );
};

export default EmployeesTable;