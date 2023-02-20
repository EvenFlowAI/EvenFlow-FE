import React, {useEffect, useMemo} from 'react';
import {centerSettingsList, ECenterSettingType, TOptContent} from "./types";
import {Grid} from "@material-ui/core";
import {CenterSettingsPlate} from "./CenterSettingsPlate";
import moment from "moment";
import {useModal, useSCs} from "../../../utils/hooks";
import ShowDropOffTimeDialog from "./ShowDropOffTimeDialog";
import {useDispatch, useSelector} from "react-redux";
import {loadCenterSettings} from "../../../store/reducers/capacityServiceValet/actions";
import {loadAllAssignedServiceRequests} from "../../../store/reducers/serviceRequests/actions";
import ServiceValetOpsCodeDialog from "./ServiceValetOpsCodeDialog";
import {RootState} from "../../../store/rootReducer";

const CenterSettings = () => {
    const {centerSettings} = useSelector((state: RootState) => state.capacityServiceValet);
    const {allAssignedList} = useSelector((state: RootState) => state.serviceRequests);
    const {onOpen: onShowTimeOpen, isOpen: isShowTimeOpen, onClose: isShowTimeClose} = useModal();
    const {onOpen: onDmsAppointmentTimeOpen, isOpen: isDmsAppointmentTimeOpen, onClose: isDmsAppointmentTimeClose} = useModal();
    const {onOpen: onServiceValetOpsCodeOpen, isOpen: isServiceValetOpsCodeOpen, onClose: onServiceValetOpsCodeClose} = useModal();
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const selectedOpsCode = useMemo(() => allAssignedList.find(item => item.serviceRequestId === centerSettings?.serviceValetRequestId),
        [allAssignedList, centerSettings])

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadCenterSettings(selectedSC.id));
            dispatch(loadAllAssignedServiceRequests(selectedSC.id))
        }
    }, [selectedSC])

    const optContent: TOptContent = {
        [ECenterSettingType.ShowDropOffTime]: {
            helperText: "",
            label: centerSettings?.isShowDropOffDescription ?? "User text (the text on the Booking Flow)",
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

    const getDateString = (time: string): string=> {
        const [hour, min, sec, ms] = time.split(':');
        return moment().set('hour', +hour).set('minute', +min).set('second', +sec).set('millisecond', +ms).format('HH:mm a')
    }

    const getCount = (k: ECenterSettingType): string|number => {
        switch (k) {
            case ECenterSettingType.ShowDropOffTime:
                return centerSettings?.isShowDropOffDescription ? "Yes" : "No";
            case ECenterSettingType.DmsAppointmentTime:
                return centerSettings?.dmsAppointmentTime
                    ? getDateString(centerSettings.dmsAppointmentTime)
                    : 'No Selected';
            default:
                return selectedOpsCode?.serviceRequest?.code ?? 'No Selected';
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
                    type={k}
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