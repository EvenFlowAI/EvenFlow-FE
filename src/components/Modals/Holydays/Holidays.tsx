import React, {useEffect} from "react";
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogTitle} from "../BaseModal";
import {Button, IconButton} from "@material-ui/core";
import {Table} from "../../UI/Table";
import {TableRowDataType} from "../../UI/types";
import {MoreHoriz} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import {AddHoliday} from "./AddHoliday";
import {useModal, usePagination, useSCs} from "../../../utils/hooks";
import {DividerThin} from "../../UI/Divider";
import {IHoliday} from "../../../store/reducers/holidays/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {loadAllHolidays} from "../../../store/reducers/holidays/actions";
import moment from "moment";
import {setHolidayPageData} from "../../../store/reducers/holidays/actions";

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
    {header: "Date", val: v => moment(v.startDate).format("MMMM D")},
    {header: "Duration", val: v => v.isAllDay ? "All day" : "Timed"},
    {header: "Recurring", val: v => v.isRecurring ? "Repeat" : "No Repeat"}
]

export const Holidays: React.FC<DialogProps> = props => {
    const [
        holidays,
        isLoading
    ] = useSelector((state: RootState) => [
        state.holidays.holidaysList,
        state.holidays.loading
    ]);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();

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

    const actions = (el: IHoliday) => {
        return <IconButton onClick={onOpen}>
            <MoreHoriz />
        </IconButton>
    }
    const {onOpen, onClose, isOpen} = useModal();
    const {changeRowsPerPage,changePage,pageIndex,pageSize} = usePagination(
        (s: RootState) => s.holidays.pageData,
        setHolidayPageData
    );

    const classes = useStyles();
    return <BaseModal {...props} width={720}>
        <DialogTitle onClose={props.onClose}>Holidays</DialogTitle>
        <div className={classes.addHoliday}>
            <Button variant="contained" color="primary" onClick={onOpen}>Add Holiday</Button>
        </div>
        <DividerThin />
        <Table<IHoliday>
            onChangePage={changePage}
            page={pageIndex}
            rowsPerPage={pageSize}
            onChangeRowsPerPage={changeRowsPerPage}
            compact
            isLoading={isLoading}
            data={holidays}
            index={"id"}
            rowData={rowData}
            actions={actions}
        />
        <DividerThin />
        <DialogActions>
            <Button onClick={props.onClose} variant="contained" color="primary">
                Close
            </Button>
        </DialogActions>
        <AddHoliday open={isOpen} onAction={reloadHolidays} onClose={onClose} />
    </BaseModal>
}