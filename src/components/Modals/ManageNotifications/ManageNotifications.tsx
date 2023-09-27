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
import {useException, useSCs} from "../../../utils/hooks";
import {loadUsersShort} from "../../../store/reducers/employees/actions";
import {loadNotifications} from "../../../store/reducers/notifications/actions";

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

export type TChangesState = {
    scNotificationsSaved: boolean;
    podNotificationsSaved: boolean;
    recallNotificationsSaved: boolean;
}

const ManageNotifications:React.FC<DialogProps> = (props) => {
    const [currentTab, setCurrentTab] = useState<string>("0");
    const [changesState, setChangesState] = useState<TChangesState>({
        scNotificationsSaved: true,
        podNotificationsSaved: true,
        recallNotificationsSaved: true,
    })
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const showError = useException()

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadUsersShort(selectedSC.id))
            dispatch(loadNotifications(selectedSC.id))
        }
    }, [selectedSC])

    const onCancel = () => {
        if (Object.values(changesState).some(value => !value)) {
            showError("Please save your entries before closing the service center notifications window.")
        } else {
            props.onClose();
        }
    }

    const checkIfChangesSaved = (tab: string): boolean => {
        switch (tab) {
            case "0":
                return changesState.scNotificationsSaved;
            case "1":
                return changesState.podNotificationsSaved;
            case "2":
                return changesState.recallNotificationsSaved;
            default:
                return true;
        }
    }

    const handleTabChange = (e: React.ChangeEvent<{}>, tab: string) => {
        if (checkIfChangesSaved(currentTab)) {
            setCurrentTab(tab)
        } else {
            showError("Please save your entries before switching to a different notification tab.")
        }
    }

    return (
        <BaseModal {...props} width={1150} onClose={onCancel}>
            <DialogTitle
                onClose={onCancel}
                style={{textTransform: 'uppercase', color: "#252525", padding: '24px 0'}}>
                Manage service center notifications
            </DialogTitle>
            <DialogContent style={{padding: 0}}>
                <TabContext value={currentTab}>
                    <TabList
                        style={{width: "100%", margin: 0, padding: 0}}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        variant="fullWidth"
                    >
                        <Tab label="Service Center Appointments" value="0"/>
                        <Tab label="POD Appointments" value="1"/>
                        <Tab label="Recall Appointments" value="2"/>
                    </TabList>
                    <TabPanel style={{width: "100%", padding: "24px 0"}} value="0">
                        <ServiceCenterAppointments setChangesState={setChangesState}/>
                    </TabPanel>
                    <TabPanel style={{width: "100%", padding: "24px 0"}} value="1">
                       <PodAppointments setChangesState={setChangesState} changesState={changesState}/>
                    </TabPanel>
                    <TabPanel style={{width: "100%", padding: "24px 0"}} value="2">
                        <RecallAppointments setChangesState={setChangesState}/>
                    </TabPanel>
                </TabContext>
            </DialogContent>
        </BaseModal>
    );
};

export default ManageNotifications;