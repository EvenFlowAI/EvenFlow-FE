import React, {ChangeEvent, useState} from 'react';
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {TEmployee, useNotificationStyles} from "./ManageNotifications";
import {IEmployee} from "../../../store/reducers/employees/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {Button, Divider} from "@material-ui/core";
import {DialogActions} from "../BaseModal";
import {IPod} from "../../../store/reducers/pods/types";

type TPodNotifications = {
    pod: IPod|null;
    employees: TEmployee[];
}

const podInitialData: TPodNotifications = {
    pod: null,
    employees: []
}

const PodAppointments = () => {
    const {employeesList, loading} = useSelector((state: RootState) => state.employees);
    const {podsList, podsLoading} = useSelector((state: RootState) => state.pods);
    const [currentEmployee, setCurrentEmployee] = useState<IEmployee|null>(null);
    const [podNotifications, setPodNotifications] = useState<TPodNotifications>(podInitialData)
    const classes = useNotificationStyles();

    const onEmployeeChange = (e: ChangeEvent<{}>, value: IEmployee|null) => {
        setCurrentEmployee(value)
    }

    const onCancel = () => {}
    const onSave = () => {}

    return (
        <div>
            <div className={classes.tabWrapper}>
                <div className={classes.tabTitle}>POD Appointments</div>

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

export default PodAppointments;