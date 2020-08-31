import React, {useEffect, useMemo, useState} from "react";
import {Table} from "../../UI/Table";
import {IconButton, Menu, MenuItem} from "@material-ui/core";
import {MoreHoriz, Visibility} from "@material-ui/icons";
import {TableRowDataType} from "../../UI/types";
import {TableAvatar} from "../TableAvatar";
import {IEmployee} from "../../../store/reducers/employees/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {loadAll, removeEmployee} from "../../../store/reducers/employees/actions";
import {useConfirm, useCurrentUser, useException, useMessage, useModal, usePagination} from "../../../utils/hooks";
import {changePageData} from "../../../store/reducers/employees/actions";
import {concatAddress} from "../../../utils/utils";
import {CreateEmployee} from "../../Modals/CreateEmployee/CreateEmployee";
import {Roles, Titles} from "../../../config/constants";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";

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

    const {askConfirm} = useConfirm();
    const showError = useException();
    const showMessage = useMessage();
    const [editedItem, setEditedItem] = useState<IEmployee|undefined>();
    const {onOpen, isOpen, onClose} = useModal();
    const [anchorEl, setAnchorEl] = useState<EventTarget&HTMLButtonElement|null>(null);
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
            showMessage(`Successfully removed ${editedItem?.fullName}`);
            setEditedItem(undefined);
        } catch (e) {
            showError(e);
        }
    }
    const deleteEmployee = () => {
        setAnchorEl(null);
        if (editedItem?.role === 'Owner') {
            showError("You can not remove dealership account");
        } else {
            askConfirm({
                title: "Remove employee?",
                content: `Are you sure want to remove ${editedItem?.fullName}?`,
                onConfirm: handleRemove
            });
        }
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

    return <>
        <TitleContainer title={Titles.Employees} pad actions />
        <Table<IEmployee>
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
        <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={editEmployee}>Edit</MenuItem>
            <MenuItem onClick={deleteEmployee}>Delete</MenuItem>
        </Menu>
        <CreateEmployee open={isOpen} payload={editedItem} onClose={onClose} />
    </>
}