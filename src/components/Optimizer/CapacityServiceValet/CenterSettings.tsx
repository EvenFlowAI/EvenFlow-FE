import React, {useEffect} from 'react';
import {centerSettingsList, ECenterSettingType, TOptContent} from "./types";
import {Grid} from "@material-ui/core";
import {CenterSettingsPlate} from "./CenterSettingsPlate";
import moment from "moment";
import {useModal, useSCs} from "../../../utils/hooks";
import ShowDropOffTimeDialog from "./ShowDropOffTimeDialog";
import {useDispatch} from "react-redux";
import {loadCenterSettings} from "../../../store/reducers/capacityServiceValet/actions";
import {loadAllAssignedServiceRequests} from "../../../store/reducers/serviceRequests/actions";
import ServiceValetOpsCodeDialog from "./ServiceValetOpsCodeDialog";

const CenterSettings = () => {
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const {onOpen: onShowTimeOpen, isOpen: isShowTimeOpen, onClose: isShowTimeClose} = useModal();
    const {onOpen: onDmsAppointmentTimeOpen, isOpen: isDmsAppointmentTimeOpen, onClose: isDmsAppointmentTimeClose} = useModal();
    const {onOpen: onServiceValetOpsCodeOpen, isOpen: isServiceValetOpsCodeOpen, onClose: onServiceValetOpsCodeClose} = useModal();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadCenterSettings(selectedSC.id));
            dispatch(loadAllAssignedServiceRequests(selectedSC.id))
        }
    }, [selectedSC])

    const optContent: TOptContent = {
        [ECenterSettingType.ShowDropOffTime]: {
            helperText: "",
            // todo change to the text
            label: "User text (the text on the BF)",
            title: "Show Drop Off Time",
        },
        [ECenterSettingType.DmsAppointmentTime]: {
            helperText: "",
            label: "",
            title: "Dms Appointment Time",
        },
        [ECenterSettingType.ServiceValetOpsCode]: {
            helperText: "",
            label: "",
            title: "Service Valet Ops Code",
        },
    }

    const getCount = (k: ECenterSettingType): string|number => {
        switch (k) {
            case ECenterSettingType.ShowDropOffTime:
                return 'No';
            case ECenterSettingType.DmsAppointmentTime:
                return moment().format('HH:mm a');
            default:
                return 28;
        }
    }

    const getPlateEdit = (k: ECenterSettingType): void => {
        switch (k) {
            case ECenterSettingType.ShowDropOffTime:
                onShowTimeOpen();
                break;
            case ECenterSettingType.DmsAppointmentTime:
                onDmsAppointmentTimeOpen();
                break;
            default:
                onServiceValetOpsCodeOpen();
        }
    }

    return (
        <Grid container spacing={3}>
            {centerSettingsList.map(k => {
                const plate = optContent[k];
                return <CenterSettingsPlate
                    key={k}
                    onEdit={() => getPlateEdit(k)}
                    title={plate.title}
                    count={getCount(k)}
                    label={plate.label}
                    prefix={plate.prefix}
                    suffix={plate.suffix}
                    helperText={plate.helperText}
                />
            })}
            <ShowDropOffTimeDialog open={isShowTimeOpen} onClose={isShowTimeClose}/>
            <ServiceValetOpsCodeDialog open={isServiceValetOpsCodeOpen} onClose={onServiceValetOpsCodeClose}/>
        </Grid>
    )
};

export default CenterSettings;