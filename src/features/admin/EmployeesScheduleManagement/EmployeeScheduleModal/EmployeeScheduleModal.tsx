import React, {useEffect, useState} from 'react';
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {TableRowDataType, TParsableDate} from "../../../../types/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import dayjs from "dayjs";
import {FormControlLabel, Switch} from "@mui/material";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {IScheduleByDate} from "../../../../store/reducers/schedules/types";

type TProps = DialogProps & {date: TParsableDate}

const EmployeeScheduleModal: React.FC<TProps> = ({date, open, onClose}) => {
    const {scheduleByDate} = useSelector((state: RootState) => state.employeesSchedule);
    const [isForWeek, setForWeek] = useState<boolean>(false);
    const [currentSchedule, setCurrentSchedule] = useState<IScheduleByDate|null>(null);

    useEffect(() => {
        if (scheduleByDate && open) setCurrentSchedule(scheduleByDate)
    }, [scheduleByDate, open])

    const handleShowOnBookingChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setForWeek(checked)
    }

    const onCancel = () => {
        setCurrentSchedule(scheduleByDate)
        onClose()
    }

    const rowData: TableRowDataType<IScheduleByDate>[] = [
        {
            header: "Employee",
            val: el => el.employeeName
        },
        {
            header: "Role",
            val: el => el.role
        },
        {
            header: "Service Book",
            val: el => el.serviceBook
        },
        {
            header: "On Schedule",
            val: el => el.serviceBook
        },
        {
            header: "Scheduled Hours",
            val: el => el.serviceBook
        },
    ]

    return (
        <BaseModal open={open} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>Employee Schedule: {dayjs(date).format("dddd, MMMM D, YYYY")}</DialogTitle>
            <DialogContent>
                <FormControlLabel
                    style={{width: '100%', display: 'flex', justifyContent: 'space-between', marginLeft: 2}}
                    labelPlacement="start"
                    control={
                        <Switch
                            name="name"
                            onChange={handleShowOnBookingChange}
                            checked={isForWeek}
                            color="primary"/>
                    }
                    label={<span style={{fontWeight: 'bold', textTransform: 'uppercase', fontSize: 13}}>Apply changes to entire week</span>}/>
            </DialogContent>
            <DialogActions>

            </DialogActions>
        </BaseModal>
    );
};

export default EmployeeScheduleModal;