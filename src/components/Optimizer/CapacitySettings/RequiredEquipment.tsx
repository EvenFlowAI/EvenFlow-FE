import React, {useCallback, useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Button, IconButton, Menu, MenuItem} from "@material-ui/core";
import {useConfirm, useException, useMessage, useModal, usePagination, useSCs} from "../../../utils/hooks";
import {Table} from "../../UI/Table";
import {TableRowDataType} from "../../UI/types";
import {IBay} from "../../../store/reducers/bays/types";
import {CheckCircle, MoreHoriz} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {loadBays, removeBay, setPageData} from "../../../store/reducers/bays/actions";
import {CreateBay} from "../../Modals/Bays/CreateBay";
import {TViewMode} from "../../Modals/types";

const useStyles = makeStyles({
    wrapper: {

    },
    actionRow: {
        textAlign: "right"
    }
});

const rowData: TableRowDataType<IBay>[] = [
    {header: "", val: v => v.name},
    {header: "Alignment Equipment", val: v => v.alignmentEquipment ? <CheckCircle color="primary" /> : "-", align: "center"},
    {header: "Carrying Capacity", val: v => v.carryingCapacity ? <CheckCircle color="primary" /> : "-", align: "center"},
    {header: "Only Quick Service", val: v => v.onlyQuickService ? <CheckCircle color="primary" /> : "-", align: "center"},
];

export const RequiredEquipment: React.FC<TViewMode> = ({viewMode}) => {
    const {onOpen, onClose, isOpen} = useModal();
    const [editedItem, setEditedItem] = useState<IBay|undefined>();
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);
    const {askConfirm, closeConfirm} = useConfirm();
    const showMessage = useMessage();
    const showError = useException();

    const [
        loading,
        bays,
        size
    ] = useSelector((state: RootState) => [
        state.bays.loading,
        state.bays.bays,
        state.bays.paging.numberOfRecords
    ]);
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
                title: `Are you sure you want to remove ${editedItem.name}?`,
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
        return <IconButton onClick={openMenu(el)}>
            <MoreHoriz />
        </IconButton>
    }, []);

    const classes = useStyles();
    return <div className={classes.wrapper}>
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
            count={size}
            actions={endActions}
            rowData={rowData}
        />
        <CreateBay open={isOpen} payload={editedItem} onClose={onClose} />
        <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={closeMenu}>
            <MenuItem onClick={openEdit}>Edit</MenuItem>
            <MenuItem onClick={askRemove}>Remove</MenuItem>
        </Menu>
    </div>
}