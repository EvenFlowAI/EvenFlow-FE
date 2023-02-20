import React, {useEffect, useMemo, useState} from 'react';
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
import {TimePicker} from "../../UI/DateTimePickers";
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";

const CenterSettings = () => {
    const {centerSettings} = useSelector((state: RootState) => state.capacityServiceValet);
    const {allAssignedList} = useSelector((state: RootState) => state.serviceRequests);
    const [calendarValue, setCalendarValue] = useState<moment.Moment>(moment())
    const [isOpen, setOpen] = useState<boolean>(false);
    const {onOpen: onShowTimeOpen, isOpen: isShowTimeOpen, onClose: isShowTimeClose} = useModal();
    const {onOpen: onServiceValetOpsCodeOpen, isOpen: isServiceValetOpsCodeOpen, onClose: onServiceValetOpsCodeClose} = useModal();
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const selectedOpsCode = useMemo(() => allAssignedList.find(item => item.serviceRequestId === centerSettings?.serviceValetRequestId),
        [allAssignedList, centerSettings])

    useEffect(() => {
        if (centerSettings?.dmsAppointmentTime) {
            const [hour, min, sec, ms] = centerSettings.dmsAppointmentTime.split(':');
            setCalendarValue(moment().set('hour', +hour).set('minute', +min).set('second', +sec).set('millisecond', +ms))
        }
    }, [centerSettings])

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

    const getCount = (k: ECenterSettingType): string|number => {
        switch (k) {
            case ECenterSettingType.ShowDropOffTime:
                return centerSettings?.isShowDropOffDescription ? "Yes" : "No";
            case ECenterSettingType.DmsAppointmentTime:
                return centerSettings?.dmsAppointmentTime
                    ? moment(centerSettings?.dmsAppointmentTime).format('HH:mm a')
                    : 'Not Selected';
            default:
                return selectedOpsCode?.serviceRequest?.code ?? 'Not Selected';
        }
    }

    const getPlateEdit = (k: ECenterSettingType): void => {
        switch (k) {
            case ECenterSettingType.ShowDropOffTime:
                onShowTimeOpen();
                break;
            case ECenterSettingType.DmsAppointmentTime:
                setOpen(true);
                break;
            default:
                onServiceValetOpsCodeOpen();
        }
    }
    const onClose = () => setOpen(false)

    const onChange = (date: ParsableDate) => {
        setCalendarValue(moment(date))
        onClose();
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
            <div style={{visibility: 'hidden'}}>
                <TimePicker
                open={isOpen}
                value={calendarValue}
                onChange={onChange}
                onClose={onClose}
            />
            </div>
        </Grid>
    )
};

export default CenterSettings;