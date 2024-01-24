import React, {useEffect, useState} from 'react';
import {centerSettingsList, ECenterSettingType, TOptContent} from "./types";
import {Grid} from "@mui/material";
import {CenterSettingsPlate} from "./CenterSettingsPlate/CenterSettingsPlate";
import moment from "moment";
import ShowDropOffTimeModal from "./ShowDropOffTimeModal/ShowDropOffTimeModal";
import {useDispatch, useSelector} from "react-redux";
import {loadCenterSettings, updateDmsAppointmentTime} from "../../../store/reducers/capacityServiceValet/actions";
import {RootState} from "../../../store/rootReducer";
import {TDmsAppointmentTime} from "../../../store/reducers/capacityServiceValet/types";
import {loadServiceValetZones} from "../../../store/reducers/serviceValet/actions";
import {useModal} from "../../../hooks/useModal/useModal";
import {useException} from "../../../hooks/useException/useException";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {ZonesOpsCodesPlate} from "./ZonesOpsCodesPlate/ZonesOpsCodesPlate";
import ZonesOpsCodeModal from "./ZonesOpsCodesModal/ZonesOpsCodeModal";
import {TParsableDate} from "../../../types/types";
import ClockTimePicker from "../../../components/pickers/ClockTimePicker/ClockTimePicker";
import dayjs from "dayjs";

const CenterSettings = () => {
    const {centerSettings, isLoading} = useSelector((state: RootState) => state.capacityServiceValet);
    const [calendarValue, setCalendarValue] = useState<TParsableDate>(dayjs())
    const [isOpen, setOpen] = useState<boolean>(false);
    const {onOpen: onShowTimeOpen, isOpen: isShowTimeOpen, onClose: isShowTimeClose} = useModal();
    const {onOpen: onServiceValetOpsCodeOpen, isOpen: isServiceValetOpsCodeOpen, onClose: onServiceValetOpsCodeClose} = useModal();
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const showError = useException();

    useEffect(() => {
        if (centerSettings?.dmsAppointmentTime) {
            const [hour, min, sec] = centerSettings.dmsAppointmentTime.split(':');
            setCalendarValue(dayjs().set('hour', +hour).set('minute', +min).set('second', +sec));
        }
    }, [centerSettings])

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadCenterSettings(selectedSC.id));
            dispatch(loadServiceValetZones(selectedSC.id))
        }
    }, [selectedSC])

    const optContent: TOptContent = {
        [ECenterSettingType.ShowDropOffTime]: {
            helperText: "",
            label: centerSettings?.dropOffTimeDescription ?? "User text (the text on the Booking Flow)",
            title: "Show Drop Off Time",
        },
        [ECenterSettingType.DmsAppointmentTime]: {
            helperText: "",
            label: "",
            title: "Dms Appointment Time",
        },
    }

    const getCount = (k: ECenterSettingType): string|number => {
        switch (k) {
            case ECenterSettingType.DmsAppointmentTime:
                return centerSettings?.dmsAppointmentTime
                    ? moment(centerSettings?.dmsAppointmentTime, "HH:mm:ss").format('HH:mm a')
                    : 'Not Selected';
            default:
                return centerSettings?.showDropOffTime ? "Yes" : "No";
        }
    }

    const getPlateEdit = (k: ECenterSettingType): void => {
        switch (k) {
            case ECenterSettingType.ShowDropOffTime:
                onShowTimeOpen();
                break;
            default:
                setOpen(true);
        }
    }
    const onClose = () => setOpen(false)

    const onChange = (date: TParsableDate) => {
        if (selectedSC) {
            const data: TDmsAppointmentTime = {dmsAppointmentTime: dayjs(date).format('HH:mm:ss')}
            dispatch(updateDmsAppointmentTime(selectedSC.id, data, onClose, showError))
        }
    }

    return (
        <Grid container spacing={3}>
            <>
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
                        isLoading={isLoading}
                    />
                })}
                <ZonesOpsCodesPlate onEdit={onServiceValetOpsCodeOpen} isLoading={isLoading}/>
            </>
            <div style={{visibility: 'hidden'}}>

            </div>
            <ClockTimePicker
                open={isOpen}
                InputProps={{
                    style: {visibility: 'hidden'}
                }}
                onAccept={onChange}
                value={calendarValue}
                onClose={onClose}/>
            <ShowDropOffTimeModal open={isShowTimeOpen} onClose={isShowTimeClose}/>
            <ZonesOpsCodeModal open={isServiceValetOpsCodeOpen} onClose={onServiceValetOpsCodeClose}/>
        </Grid>
    )
};

export default CenterSettings;