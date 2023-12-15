import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from 'react';
import {Table} from "../../../components/UI/Table";
import {IServiceCenterExtended, IServiceCenterForm} from "../../../store/reducers/serviceCenters/types";
import {IconButton, Menu, MenuItem} from "@material-ui/core";
import {useConfirm, useCurrentUser, useException, useMessage, usePagination} from "../../../utils/hooks";
import {RootState} from "../../../store/rootReducer";
import {changePageData, loadAll, removeSC, setSCOrder} from "../../../store/reducers/serviceCenters/actions";
import {MoreHoriz, Visibility} from "@material-ui/icons";
import {TableAvatar} from "../../../components/TableAvatar/TableAvatar";
import {IOrder, TCallback} from "../../../types/types";
import {useDispatch, useSelector} from "react-redux";
import {TableRowDataType} from "../../../components/UI/types";
import {concatAddress} from "../../../utils/utils";

const rowDataSU: TableRowDataType<IServiceCenterExtended>[] = [
    {val: (el: IServiceCenterExtended) => el.dealership.name, header: "Dealership group"},
    {val: (el: IServiceCenterExtended) => el.name, header: "Service center name", orderId: "name"},
    {val: (el: IServiceCenterExtended) => concatAddress(el.address), header: "Service center address"},
    {val: (el: IServiceCenterExtended) => el.countOfBays.toString(), header: "Bays", align: "center", orderId: "countOfBays"},
];

const rowDataA: TableRowDataType<IServiceCenterExtended>[] = [
    {val: v => v.name, header: "Name", orderId: "name"},
    {val: v => concatAddress(v.address), header: "Address"},
    {val: v => v.countOfEmployees.toString(), header: "Employees", align: "center", orderId: "countOfEmployees"},
    {val: v => v.countOfBays.toString(), header: "Bays", align: "center", orderId: "countOfBays"}
];

type TProps = {
    setEditedItem: Dispatch<SetStateAction<IServiceCenterForm|undefined>>;
    editedItem: IServiceCenterForm|undefined;
    onOpen: TCallback;
}

const ServiceCentersTable: React.FC<TProps> = ({setEditedItem, editedItem, onOpen}) => {
    const [data, loading, count, order, search] = useSelector((state: RootState) => [
        state.serviceCenters.serviceCenters,
        state.serviceCenters.loading,
        state.serviceCenters.paging.numberOfRecords,
        state.serviceCenters.order,
        state.serviceCenters.searchTerm
    ]);

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
    }, [dispatch, order, search]);

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
                data={data}
                order={order.orderBy}
                onSort={handleSort}
                isAscending={order.isAscending}
                noDataTitle="No Service Centers present"
                isLoading={loading}
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

            <Menu onClose={() => setAnchorEl(null)} anchorEl={anchorEl} open={Boolean(anchorEl)}>
                <MenuItem onClick={openEdit}>Edit</MenuItem>
                <MenuItem onClick={openRemove}>Remove</MenuItem>
            </Menu>
        </>
    );
};

export default ServiceCentersTable;