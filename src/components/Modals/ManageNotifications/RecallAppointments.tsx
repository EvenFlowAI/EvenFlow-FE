import React, {ChangeEvent, useState} from 'react';
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {initialData, TSCNotifications, useNotificationStyles} from "./ManageNotifications";
import {IEmployee} from "../../../store/reducers/employees/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {Button, Divider} from "@material-ui/core";
import {DialogActions} from "../BaseModal";

const RecallAppointments = () => {
    const {employeesList, loading} = useSelector((state: RootState) => state.employees);
    const [currentEmployee, setCurrentEmployee] = useState<IEmployee|null>(null);
    const [recallNotifications, setRecallNotifications] = useState<TSCNotifications>(initialData)
    const classes = useNotificationStyles();

    const onEmployeeChange = (e: ChangeEvent<{}>, value: IEmployee|null) => {
        setCurrentEmployee(value)
    }

    const onCancel = () => {}
    const onSave = () => {}

    return (
        <div>
            <div className={classes.tabWrapper}>
                <div className={classes.tabTitle}>Recall Appointments</div>

                <Autocomplete
                    options={employeesList}
                    fullWidth
                    getOptionLabel={i => i.fullName}
                    value={currentEmployee}
                    onChange={onEmployeeChange}
                    renderInput={autocompleteRender({
                        label: "Assign Employee",
                        placeholder: 'Select'
                    })}
                />
            </div>
            <Divider/>
            <DialogActions>
                <Button onClick={onCancel} variant="outlined" color="primary">
                    Cancel
                </Button>
                <Button onClick={onSave} variant="contained" color="primary">
                    Save
                </Button>
            </DialogActions>
        </div>
    );
};

export default RecallAppointments;