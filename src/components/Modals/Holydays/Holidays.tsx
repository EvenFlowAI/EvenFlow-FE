import React, {useEffect, useState} from "react";
import {DialogProps, TViewMode} from "../types";
import {BaseModal, DialogActions, DialogTitle} from "../BaseModal";
import {Button, IconButton, Menu, MenuItem} from "@material-ui/core";
import {Table} from "../../UI/Table";
import {TableRowDataType} from "../../UI/types";
import {MoreHoriz} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import {AddHoliday} from "./AddHoliday";
import {useConfirm, useException, useMessage, useModal, usePagination, useSCs} from "../../../utils/hooks";
import {IHoliday} from "../../../store/reducers/holidays/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {loadAllHolidays} from "../../../store/reducers/holidays/actions";
import moment from "moment";
import {setHolidayPageData} from "../../../store/reducers/holidays/actions";
import {Api} from "../../../config/requests";

const useStyles = makeStyles({
    divider: {
        margin: "0 !important"
    },
    addHoliday: {
        textAlign: "right",
        marginBottom: 5,
        marginRight: 15
    }
});

const rowData: TableRowDataType<IHoliday>[] = [
    {header: "Description Title", val: v => v.description},
    {header: "Date", val: v => moment(v.date).format("MMMM D")},
    {header: "Recurring", val: v => v.isRecurring ? "Repeat" : "No Repeat"}
]

export const Holidays: React.FC<DialogProps&TViewMode> = props => {
    const [
        holidays,
        isLoading
    ] = useSelector((state: RootState) => [
        state.holidays.holidaysList,
        state.holidays.loading
    ]);
    const [editedItem, setEditedItem] = useState<IHoliday|undefined>();
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const showMessage = useMessage();
    const showError = useException();
    const {askConfirm, closeConfirm} = useConfirm();

    useEffect(() => {
        if (props.open && selectedSC) {
            dispatch(loadAllHolidays(selectedSC.id));
        }
    }, [dispatch, props.open, selectedSC]);
    const reloadHolidays = () => {
        if (selectedSC) {
            dispatch(loadAllHolidays(selectedSC.id));
        }
    }
    const openMenu = (el: IHoliday) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setEditedItem(el);
        setAnchorEl(e.currentTarget);
    }
    const closeMenu = () => {
        setAnchorEl(null);
    }
    const handleRemove = async () => {
        if (editedItem) {
            try {
                await Api.call(
                    Api.endpoints.Holidays.Remove,
                    {urlParams: {id: editedItem.id}}
                )
                showMessage("Holiday removed");
            } catch (e) {
                showError(e);
            }
        }
        closeConfirm();
        reloadHolidays();
    }
    const askRemove = () => {
        closeMenu();
        if (editedItem) {
            askConfirm({
                isRemove: true,
                title: `Remove ${editedItem.description}?`,
                onConfirm: handleRemove
            })
        }
    }
    const openEdit = () => {
        closeMenu();
        onOpen();
    }

    const actions = (el: IHoliday) => {
        return <IconButton onClick={openMenu(el)}>
            <MoreHoriz />
        </IconButton>
    }
    const {onOpen, onClose, isOpen} = useModal();
    const {changeRowsPerPage,changePage,pageIndex,pageSize} = usePagination(
        (s: RootState) => s.holidays.pageData,
        setHolidayPageData
    );
    const handleOpenCreate = () => {
        setEditedItem(undefined);
        onOpen();
    }

    const classes = useStyles();
    return <BaseModal {...props} width={720}>
        <DialogTitle onClose={props.onClose}>Holidays</DialogTitle>
        {!props.viewMode ? <div className={classes.addHoliday}>
            <Button variant="contained" color="primary" onClick={handleOpenCreate}>Add Holiday</Button>
        </div> : null}
        <Table<IHoliday>
            onChangePage={changePage}
            page={pageIndex}
            viewMode={props.viewMode}
            rowsPerPage={pageSize}
            onChangeRowsPerPage={changeRowsPerPage}
            compact
            isLoading={isLoading}
            data={holidays}
            index={"id"}
            rowData={rowData}
            actions={actions}
        />
        <DialogActions>
            <Button onClick={props.onClose} variant="contained" color="primary">
                Close
            </Button>
        </DialogActions>
        <Menu
            onClose={closeMenu}
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}>
            <MenuItem onClick={openEdit}>Edit</MenuItem>
            <MenuItem onClick={askRemove}>Remove</MenuItem>
        </Menu>
        <AddHoliday open={isOpen} payload={editedItem} onAction={reloadHolidays} onClose={onClose} />
    </BaseModal>
}