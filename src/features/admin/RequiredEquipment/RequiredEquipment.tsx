import React, {useCallback, useEffect, useState} from "react";
import {Button, IconButton, Menu, MenuItem} from "@mui/material";
import {Table} from "../../../components/tables/Table/Table";
import {IBay} from "../../../store/reducers/bays/types";
import {CheckCircle, MoreHoriz} from "@mui/icons-material";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {loadBays, removeBay, setPageData} from "../../../store/reducers/bays/actions";
import {CreateBayModal} from "./CreateBayModal/CreateBayModal";
import {TViewMode} from "../../../components/modals/BaseModal/types";
import {useStyles} from "./styles";
import {TableRowDataType} from "../../../types/types";
import {useModal} from "../../../hooks/useModal/useModal";
import {useConfirm} from "../../../hooks/useConfirm/useConfirm";
import {usePagination} from "../../../hooks/usePaginations/usePaginations";

import {useMessage} from "../../../hooks/useMessage/useMessage";
import {useException} from "../../../hooks/useException/useException";
import {useSCs} from "../../../hooks/useSCs/useSCs";

const rowData: TableRowDataType<IBay>[] = [
    {header: "", val: v => v.name},
    {header: "Alignment Equipment", val: v => v.alignmentEquipment ? <CheckCircle color="primary" /> : "-", align: "center"},
    {header: "Carrying Capacity", val: v => v.carryingCapacity ? <CheckCircle color="primary" /> : "-", align: "center"},
    {header: "Only Quick Service", val: v => v.onlyQuickService ? <CheckCircle color="primary" /> : "-", align: "center"},
];

export const RequiredEquipment: React.FC<React.PropsWithChildren<React.PropsWithChildren<TViewMode>>> = ({viewMode}) => {
    const {loading, bays, paging:{numberOfRecords}} = useSelector(({bays}: RootState) => bays);
    const [editedItem, setEditedItem] = useState<IBay|undefined>();
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);

    const {onOpen, onClose, isOpen} = useModal();
    const {askConfirm, closeConfirm} = useConfirm();
    const showMessage = useMessage();
    const showError = useException();
    const classes = useStyles();

    const {selectedSC} = useSCs();
    const dispatch = useDispatch();

    const {pageIndex, pageSize, changeRowsPerPage, changePage} = usePagination(state => state.bays.pageData, setPageData);

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadBays(selectedSC.id));
        }
    }, [dispatch, selectedSC, pageIndex, pageSize]);

    const openCreate = () => {
        setAnchorEl(null);
        setEditedItem(undefined);
        onOpen();
    }
    const openEdit = () => {
        setAnchorEl(null);
        onOpen();
    }
    const openMenu = (el: IBay) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setEditedItem(el);
        setAnchorEl(e.currentTarget);
    }
    const askRemove = () => {
        setAnchorEl(null);
        if (editedItem) {
            askConfirm({
                isRemove: true,
                title: `Please confirm you want to remove ${editedItem.name}?`,
                onConfirm: handleRemove
            })
        }
    }
    const handleRemove = async () => {
        if (!editedItem) {
            showError("Bay is not selected")
        } else {
            try {
                dispatch(removeBay(editedItem));
                showMessage("Bay removed");
                setEditedItem(undefined);
                closeConfirm();
            } catch (e) {
                showError(e);
            }
        }
    }
    const closeMenu = () => {
        setAnchorEl(null);
    }

    const endActions = useCallback((el: IBay) => {
        return (
            <IconButton onClick={openMenu(el)} size="large">
                <MoreHoriz />
            </IconButton>
        );
    }, []);

    return <div>
        {!viewMode ? <div className={classes.actionRow}>
            <Button
                color="primary"
                variant="contained"
                onClick={openCreate}
            >
                Add Bay
            </Button>
        </div> : null}
        <Table<IBay>
            data={bays}
            compact
            isLoading={loading}
            viewMode={viewMode}
            index="id"
            onChangePage={changePage}
            onChangeRowsPerPage={changeRowsPerPage}
            rowsPerPage={pageSize}
            page={pageIndex}
            count={numberOfRecords}
            actions={endActions}
            rowData={rowData}
        />
        <CreateBayModal open={isOpen} payload={editedItem} onClose={onClose} />
        <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={closeMenu}>
            <MenuItem onClick={openEdit}>Edit</MenuItem>
            <MenuItem onClick={askRemove}>Remove</MenuItem>
        </Menu>
    </div>
}