import React from "react";
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogTitle} from "../BaseModal";
import {Button, IconButton} from "@material-ui/core";
import {Table} from "../../UI/Table";
import moment, {Moment} from "moment";
import {TableRowDataType} from "../../UI/types";
import {MoreHoriz} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import {AddHoliday} from "./AddHoliday";
import {useModal} from "../../../utils/hooks";
import {DividerThin} from "../../UI/Divider";

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


type THoliday = {
    title: string;
    date: Moment;
    duration: "All day";
    recurring: "No repeat" | "Repeat";
}
const holidays: THoliday[] = [
    {title: "Christmas", date: moment().month(11).date(25), duration: "All day", recurring: "Repeat"},
    {title: "New Year", date: moment().month(0).date(1), duration: "All day", recurring: "Repeat"},
    {title: "Easter", date: moment().month(2).date(1), duration: "All day", recurring: "No repeat"},
]

const rowData: TableRowDataType<THoliday>[] = [
    {header: "Description Title", val: v => v.title},
    {header: "Date", val: v => v.date.format("MMMM D")},
    {header: "Duration", val: v => v.duration},
    {header: "Recurring", val: v => v.recurring}
]

export const Holidays: React.FC<DialogProps> = props => {
    const actions = (el: THoliday) => {
        return <IconButton onClick={onOpen}>
            <MoreHoriz />
        </IconButton>
    }
    const {onOpen, onClose, isOpen} = useModal();

    const classes = useStyles();
    return <BaseModal {...props} width={720}>
        <DialogTitle onClose={props.onClose}>Holidays</DialogTitle>
        <div className={classes.addHoliday}>
            <Button variant="contained" color="primary" onClick={onOpen}>Add Holiday</Button>
        </div>
        <DividerThin />
        <Table hidePagination compact data={holidays} index={"title"} rowData={rowData} actions={actions} />
        <DividerThin />
        <DialogActions>
            <Button onClick={props.onClose} variant="contained" color="primary">
                Close
            </Button>
        </DialogActions>
        <AddHoliday open={isOpen} onClose={onClose} />
    </BaseModal>
}