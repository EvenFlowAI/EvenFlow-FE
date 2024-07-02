import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from 'react';
import {Table} from "../../../../components/tables/Table/Table";
import {IServiceCenterExtended, IServiceCenterForm} from "../../../../store/reducers/serviceCenters/types";
import {IconButton, Menu, MenuItem} from "@mui/material";
import {RootState} from "../../../../store/rootReducer";
import {changePageData, loadAll, removeSC, setSCOrder} from "../../../../store/reducers/serviceCenters/actions";
import {MoreHoriz, Visibility} from "@mui/icons-material";
import {TableAvatar} from "../../../../components/wrappers/TableAvatar/TableAvatar";
import {IOrder, TableRowDataType, TCallback} from "../../../../types/types";
import {useDispatch, useSelector} from "react-redux";
import {concatAddress} from "../../../../utils/utils";
import {useConfirm} from "../../../../hooks/useConfirm/useConfirm";
import {usePagination} from "../../../../hooks/usePaginations/usePaginations";

import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {useException} from "../../../../hooks/useException/useException";
import {useCurrentUser} from "../../../../hooks/useCurrentUser/useCurrentUser";

const rowDataSU: TableRowDataType<IServiceCenterExtended>[] = [
    {val: (el: IServiceCenterExtended) => el.dealership.name, header: "Dealership group"},
    {val: (el: IServiceCenterExtended) => el.name, header: "Service center name", orderId: "name"},
    {val: (el: IServiceCenterExtended) => concatAddress(el.address), header: "Service center address"},
    {val: (el: IServiceCenterExtended) => el.id.toString(), header: "Service Center ID", orderId: "id", width: 200},
];

const rowDataA: TableRowDataType<IServiceCenterExtended>[] = [
    {val: v => v.name, header: "Name", orderId: "name"},
    {val: v => concatAddress(v.address), header: "Address"},
    {val: v => v.countOfEmployees.toString(), header: "Employees", orderId: "countOfEmployees"},
    {val: v => v.id.toString(), header: "Service Center ID", orderId: "id", width: 200}
];

type TProps = {
    setEditedItem: Dispatch<SetStateAction<IServiceCenterForm|undefined>>;
    editedItem: IServiceCenterForm|undefined;
    onOpen: TCallback;
}

const ServiceCentersTable: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({setEditedItem, editedItem, onOpen}) => {
    const {
        serviceCenters,
        loading,
        paging: {numberOfRecords},
        order,
        searchTerm
    } = useSelector(({serviceCenters}: RootState) => serviceCenters);

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement & EventTarget | null>(null);
    const currentUser = useCurrentUser();
    const dispatch = useDispatch();
    const showError = useException();
    const showMessage = useMessage();
    const {askConfirm} = useConfirm();
    const {changeRowsPerPage, changePage, pageIndex, pageSize} = usePagination(
        (s: RootState) => s.serviceCenters.pageData,
        changePageData
    );
    const rowData = useMemo(() => {
        return currentUser?.isSuperUser ? rowDataSU : rowDataA;
    }, [currentUser]);

    useEffect(() => {
        dispatch(loadAll())
    }, [dispatch, order, searchTerm]);

    const handleView = (el: IServiceCenterExtended) => () => {
        setEditedItem(el);
        onOpen();
    };

    const openEdit = () => {
        setAnchorEl(null);
        onOpen();
    }
    const handleSetAnchor = (el: IServiceCenterExtended) => (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const data: IServiceCenterForm = el as IServiceCenterForm;
        setEditedItem(data);
        setAnchorEl(e.currentTarget);
    }
    const viewActions = (el: IServiceCenterExtended) => (
        currentUser?.isSuperUser
            ? <IconButton size="small" onClick={handleView(el)}><Visibility /></IconButton>
            : <IconButton size="small"
                          onClick={handleSetAnchor(el)}><MoreHoriz/></IconButton>
    );

    const startActions = (el: IServiceCenterExtended) => (
        <TableAvatar name={el.name} src={el.avatarPath} />
    )

    const handleRemove = async () => {
        try {
            await dispatch(removeSC(editedItem?.id));
            showMessage(`Service Center removed`);
            setEditedItem(undefined);
        } catch (e) {
            showError(e);
        }
    }

    const openRemove = () => {
        setAnchorEl(null);
        askConfirm({
            isRemove: true,
            title: `Please confirm you want to remove Service Center ${editedItem?.name}?`,
            onConfirm: handleRemove
        });
    }

    const handleSort = (d: IOrder<IServiceCenterExtended>) => () => {
        dispatch(setSCOrder(d));
    }
    return (
        <>
            <Table<IServiceCenterExtended>
                data={serviceCenters}
                order={order.orderBy}
                onSort={handleSort}
                isAscending={order.isAscending}
                noDataTitle="No Service Centers present"
                isLoading={loading}
                rowData={rowData}
                onChangePage={changePage}
                onChangeRowsPerPage={changeRowsPerPage}
                count={numberOfRecords}
                page={pageIndex}
                rowsPerPage={pageSize}
                startActions={startActions}
                index="id"
                actions={viewActions}
            />

            <Menu onClose={() => setAnchorEl(null)} anchorEl={anchorEl} open={Boolean(anchorEl)}>
                <MenuItem onClick={openEdit}>Edit</MenuItem>
                <MenuItem onClick={openRemove}>Remove</MenuItem>
            </Menu>
        </>
    );
};

export default ServiceCentersTable;