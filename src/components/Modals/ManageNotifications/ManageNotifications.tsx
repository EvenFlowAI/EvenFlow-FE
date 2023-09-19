import React, {ChangeEvent, useState} from 'react';
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {TabList} from "../../UI/Tabs";
import {styled, Tab} from "@material-ui/core";
import {Autocomplete, TabContext, TabPanel} from "@material-ui/lab";
import {makeStyles} from "@material-ui/core/styles";
import {IEmployee} from "../../../store/reducers/employees/types";
import {IPod} from "../../../store/reducers/pods/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {autocompleteRender} from "../../UI/AutocompleteRender";

const useStyles = makeStyles({
    tabTitle: {
        fontSize: 16,
        fontWeight: 700,
        color: "#252525",
        textAlign: 'center',
        textTransform: "uppercase",
        paddingBottom: 25
    },
    tabWrapper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "center"
    }
})

type TEmployee = {
    id: string;
    name: string;
    email: string;
}

type TSCNotifications = {
    isActive: boolean;
    employees: TEmployee[];
}

type TPodNotifications = {
    pod: IPod|null;
    employees: TEmployee[];
}

const initialData: TSCNotifications = {
    isActive: false,
    employees: []
}

const podInitialData: TPodNotifications = {
    pod: null,
    employees: []
}

type TOption = {
    value: number;
    name: string;
}

const ManageNotifications:React.FC<DialogProps> = (props) => {
    const {employeesList, loading} = useSelector((state: RootState) => state.employees);
    const {podsList, podsLoading} = useSelector((state: RootState) => state.pods);
    const [currentTab, setCurrentTab] = useState<string>("0");
    const [scNotifications, setScNotifications] = useState<TSCNotifications>(initialData)
    const [recallNotifications, setRecallNotifications] = useState<TSCNotifications>(initialData)
    const [podNotifications, setPodNotifications] = useState<TPodNotifications>(podInitialData)
    const [currentEmployee, setCurrentEmployee] = useState<IEmployee|null>(null);
    const classes = useStyles();

    const onCancel = () => {
        props.onClose();
    }

    const handleTabChange = (e: React.ChangeEvent<{}>, tab: string) => {
        setCurrentEmployee(null);
        setCurrentTab(tab)
    }

    const onEmployeeChange = (tab: string) => (e: ChangeEvent<{}>, value: IEmployee|null) => {
        setCurrentEmployee(value)
    }

    return (
        <BaseModal {...props} width={1150} onClose={onCancel}>
            <DialogTitle
                onClose={onCancel}
                style={{textTransform: 'uppercase', color: "#252525", padding: '24px 0'}}>
                Manage service center notifications
            </DialogTitle>
            <DialogContent style={{padding: "25px 255px"}}>
                <TabContext value={currentTab}>
                    <TabList
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        variant="fullWidth"
                    >
                        <Tab label="Service Center Appointments" value="0"/>
                        <Tab label="POD Appointments" value="1"/>
                        <Tab label="Recall Appointments" value="2"/>
                    </TabList>
                    <TabPanel style={{width: "100%", padding: "24px 0"}} value="0">
                        <div className={classes.tabWrapper}>
                            <div className={classes.tabTitle}>Service Center Appointments</div>

                            <Autocomplete
                                options={employeesList}
                                getOptionLabel={i => i.fullName}
                                value={currentEmployee}
                                onChange={onEmployeeChange(currentTab)}
                                renderInput={autocompleteRender({
                                    label: "Appointment Type",
                                    placeholder: 'Appointment Type'
                                })}
                            />
                        </div>
                    </TabPanel>
                    <TabPanel style={{width: "100%", padding: "24px 0"}} value="1">
                        <div className={classes.tabWrapper}>
                            <div className={classes.tabTitle}>POD Appointments</div>
                        </div>
                    </TabPanel>
                    <TabPanel style={{width: "100%", padding: "24px 0"}} value="2">
                        <div className={classes.tabWrapper}>
                            <div className={classes.tabTitle}>Recall Appointments</div>
                        </div>
                    </TabPanel>
                </TabContext>
            </DialogContent>
        </BaseModal>
    );
};

export default ManageNotifications;