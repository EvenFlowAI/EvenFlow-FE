import React, {useState} from "react";
import {Table} from "../../UI/Table";
import {IconButton, Menu, MenuItem, Typography} from "@material-ui/core";
import {MoreHoriz} from "@material-ui/icons";
import {TableRowDataType} from "../../UI/types";
import {IDealershipGroupExtended} from "../../../store/reducers/dealershipGroups/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import * as dealershipActions from "../../../store/reducers/dealershipGroups/actions";
import {changePageData, remove as removeDealership} from "../../../store/reducers/dealershipGroups/actions";
import {useConfirm, useException, useMessage, usePagination} from "../../../utils/hooks";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {Titles} from "../../../config/constants";
import {useHistory} from "react-router-dom";
import {Routes} from "../../../config/routes";
import {concatAddress} from "../../../utils/utils";
import {API} from "../../../api/api";
import {authService} from "../../../config/requests";


const rowData: TableRowDataType<IDealershipGroupExtended>[] = [
    {val: el => el.name, header: "Dealership name"},
    {val: el => el.countOfServiceCenters.toString(), header: "Service centers", align: "center"},
    {val: el => el.countOfEmployees.toString(), header: "Employees", align: "center"},
    {val: el => concatAddress(el.address), header: "Address"}
];


export const DealershipGroups = () => {
    const {count, data, isLoading} = useSelector((state: RootState) => ({
        count: state.dealershipGroups.paging.numberOfRecords,
        data: state.dealershipGroups.dealershipList,
        isLoading: state.dealershipGroups.loading
    }));

    const {changeRowsPerPage,changePage,pageIndex,pageSize} = usePagination(
        (s: RootState) => s.dealershipGroups.pageData,
        changePageData
    );

    const [editedItem, setEditedItem] = useState<IDealershipGroupExtended|null>(null);
    const [anchorEl, setAnchorEl] = useState<EventTarget&HTMLButtonElement|null>(null);

    const {askConfirm} = useConfirm();
    const dispatch = useDispatch();
    const showError = useException();
    const showMessage = useMessage();
    const history = useHistory();

    const handleView = ()  => {
        if (!editedItem) return;
        setAnchorEl(null);
        history.push(`${Routes.Admin.DealershipGroups}/${editedItem.id}`);
    };
    const handleRemoveAction = () => {
        setAnchorEl(null);
        askConfirm({
            title: `Are you sure want to remove dealership group ${editedItem?.name}?`,
            isRemove: true,
            onConfirm: async () => {
                await handleRemove();
            }
        });
    };
    const handleRemove = async () => {
        if (!editedItem) return;
        const d = editedItem
        try {
            await dispatch(removeDealership(d.id));
            showMessage(`Successfully removed ${d.name}`);
        } catch (e) {
            showError(e);
        }
    }

    const handleLogin = async () => {
        setAnchorEl(null);
        try {
            await authService.dealershipLogin(editedItem?.id??0);
            window.location.reload();
        } catch (e) {
            showError(e);
        }
    }

    const closeMenu = () => {
        setEditedItem(null);
        setAnchorEl(null);
    }

    const openMenu = (el: IDealershipGroupExtended) =>
        (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setEditedItem(el);
        setAnchorEl(e.currentTarget);
    }

    const viewActions = (el: IDealershipGroupExtended) =>
        <IconButton size="small" onClick={openMenu(el)}>
            <MoreHoriz />
        </IconButton>
    ;

    React.useEffect(() => {
        dispatch(dealershipActions.loadAll());
    }, [dispatch]);

    return <>
        <TitleContainer title={Titles.DealershipGroups} actions pad />
        <Table<IDealershipGroupExtended>
            data={data}
            noDataTitle="No Dealership Groups are present"
            isLoading={isLoading}
            rowData={rowData}
            onChangePage={changePage}
            onChangeRowsPerPage={changeRowsPerPage}
            count={count}
            page={pageIndex}
            rowsPerPage={pageSize}
            index="id"
            actions={viewActions}
        />
        <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={closeMenu}>
            <MenuItem onClick={handleView}>View</MenuItem>
            <MenuItem onClick={handleLogin}>Login</MenuItem>
            <MenuItem onClick={handleRemoveAction}>
                <Typography color="secondary">Remove</Typography>
            </MenuItem>
        </Menu>
    </>
}