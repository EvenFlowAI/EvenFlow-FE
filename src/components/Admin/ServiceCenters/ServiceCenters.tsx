import React, {useEffect, useMemo, useState} from "react";
import {TableRowDataType} from "../../UI/types";
import {IconButton, Menu, MenuItem} from "@material-ui/core";
import {MoreHoriz, Visibility} from "@material-ui/icons";
import {TableAvatar} from "../TableAvatar";
import {Table} from "../../UI/Table";
import {IServiceCenterExtended, IServiceCenterForm} from "../../../store/reducers/serviceCenters/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {loadAll, removeSC} from "../../../store/reducers/serviceCenters/actions";
import {useConfirm, useCurrentUser, useException, useMessage, useModal, usePagination} from "../../../utils/hooks";
import {changePageData} from "../../../store/reducers/dealershipGroups/actions";
import {CreateServiceCenter} from "../../Modals/CreateServiceCenter/CreateServiceCenter";
import {concatAddress} from "../../../utils/utils";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {Titles} from "../../../config/constants";


const rowDataSU: TableRowDataType<IServiceCenterExtended>[] = [
    {val: (el: IServiceCenterExtended) => el.dealership.name, header: "Dealership group"},
    {val: (el: IServiceCenterExtended) => el.name, header: "Service center name", orderId: "name"},
    {val: (el: IServiceCenterExtended) => el.mainAddress, header: "Service center address", orderId: "mainAddress"},
    {val: (el: IServiceCenterExtended) => el.countOfBays.toString(), header: "Bays", align: "center", orderId: "countOfBays"},
];

const rowDataA: TableRowDataType<IServiceCenterExtended>[] = [
    {val: v => v.name, header: "Name", orderId: "name"},
    {val: v => concatAddress(v.address), header: "Address", orderId: "address"},
    {val: v => v.countOfEmployees.toString(), header: "Employees", align: "center", orderId: "countOfEmployees"},
    {val: v => v.countOfBays.toString(), header: "Bays", align: "center", orderId: "countOfBays"}
];

export const ServiceCenters = () => {
    const {data, loading, count} = useSelector((state: RootState) => ({
        data: state.serviceCenters.serviceCenters,
        loading: state.serviceCenters.loading,
        count: state.serviceCenters.paging.numberOfRecords
    }));
    const currentUser = useCurrentUser();
    const rowData = useMemo(() => {
        return currentUser?.isSuperUser ? rowDataSU : rowDataA;
    }, [currentUser]);
    const order = useSelector((state: RootState) => state.serviceCenters.order);

    const dispatch = useDispatch();
    const {changeRowsPerPage, changePage, pageIndex, pageSize} = usePagination(
        (s: RootState) => s.dealershipGroups.pageData,
        changePageData
    );
    const showError = useException();
    const showMessage = useMessage();

    useEffect(() => {
        dispatch(loadAll())
    }, [dispatch, pageIndex, pageSize]);

    const handleView = (el: IServiceCenterExtended) => () => alert(`View ${el.name}`);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement & EventTarget | null>(null);

    const openEdit = () => {
        setAnchorEl(null);
        onOpen();
    }
    const handleSetAnchor = (
        el: IServiceCenterExtended
    ) => (
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

    const {askConfirm} = useConfirm();

    const handleRemove = async () => {
        try {
            await dispatch(removeSC(editedItem?.id));
            showMessage(`${editedItem?.name} removed`);
            setEditedItem(undefined);
        } catch (e) {
            showError(e);
        }

    }

    const openRemove = () => {
        setAnchorEl(null);
        askConfirm({
            isRemove: true,
            title: `Remove service center ${editedItem?.name}?`,
            onConfirm: handleRemove
        });
    }

    const {onOpen, onClose, isOpen} = useModal();
    const [editedItem, setEditedItem] = useState<IServiceCenterForm|undefined>();

    return <>
        <TitleContainer title={Titles.ServiceCenters} actions pad />
        <Table<IServiceCenterExtended>
            data={data}
            order={order.orderBy}
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
        <CreateServiceCenter open={isOpen} onClose={onClose} payload={editedItem} />
    </>
}