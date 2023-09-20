import React, {useEffect, useState} from 'react';
import {DialogProps} from "../types";
import {BaseModal, DialogContent, DialogTitle} from "../BaseModal";
import {TabList} from "../../UI/Tabs";
import {Tab} from "@material-ui/core";
import {TabContext, TabPanel} from "@material-ui/lab";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch} from "react-redux";
import ServiceCenterAppointments from "./ServiceCenterAppointments";
import PodAppointments from "./PodAppointments";
import RecallAppointments from "./RecallAppointments";
import {useSCs} from "../../../utils/hooks";
import {loadByFilters, setEmployeeFilters} from "../../../store/reducers/employees/actions";

export const useNotificationStyles = makeStyles({
    tabTitle: {
        fontSize: 16,
        fontWeight: 700,
        color: "#252525",
        textAlign: 'center',
        textTransform: "uppercase",
        paddingBottom: 25
    },
    tabWrapper: {
        width: 400,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "center",
        margin: 'auto'
    },
    notificationsLabel: {
        fontSize: 12,
        fontWeight: 700,
        textTransform: 'uppercase',
        margin: 0,
    },
    switcherWrapper: {
        display: 'flex',
        alignItems: "center",
        marginBottom: 10,
    },
    selectWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    addButton: {
        fontSize: 12,
        textTransform: 'none',
        marginLeft: 8,
    },
    employeeWrapper: {
        display: 'grid',
        gridTemplateColumns: '2fr 3fr 1fr',
        alignItems: "center",
        gap: '8px',
        marginTop: 9,
    }
})

export type TEmployee = {
    id: string;
    name: string;
    email: string;
}

export type TSCNotifications = {
    isActive: boolean;
    employeeIds: string[];
}

export const initialData: TSCNotifications = {
    isActive: false,
    employeeIds: []
}

const ManageNotifications:React.FC<DialogProps> = (props) => {
    const [currentTab, setCurrentTab] = useState<string>("0");
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedSC) {
            dispatch(setEmployeeFilters({serviceCenterId: selectedSC.id}))
        }
    }, [selectedSC])

    useEffect(() => {
        selectedSC && dispatch(loadByFilters())
    }, [selectedSC])

    const onCancel = () => {
        props.onClose();
    }

    const handleTabChange = (e: React.ChangeEvent<{}>, tab: string) => {
        setCurrentTab(tab)
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
                        <ServiceCenterAppointments/>
                    </TabPanel>
                    <TabPanel style={{width: "100%", padding: "24px 0"}} value="1">
                       <PodAppointments/>
                    </TabPanel>
                    <TabPanel style={{width: "100%", padding: "24px 0"}} value="2">
                        <RecallAppointments/>
                    </TabPanel>
                </TabContext>
            </DialogContent>
        </BaseModal>
    );
};

export default ManageNotifications;