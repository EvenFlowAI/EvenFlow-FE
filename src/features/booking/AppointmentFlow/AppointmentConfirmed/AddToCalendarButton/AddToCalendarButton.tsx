import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Button} from "@mui/material";
import {concatAddress} from "../../../../../utils/utils";
import {
    calendarDateFormat,
    dateTimeString,
    G_CALENDAR_FORMAT,
    time24HourFormat,
    timeSpanString
} from "../../../../../utils/constants";
import moment from "moment";
import {EServiceType} from "../../../../../store/reducers/appointmentFrameReducer/types";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {TItem} from "../types";
import {getCalendarUrl} from "./utils";
import {TServiceValetSlot} from "../../../../../api/types";

type TProps = {
    serviceName: string,
    servicesList: string[],
}

const AddToCalendarButton: React.FC<React.PropsWithChildren<TProps>> = ({ serviceName, servicesList}) => {
    const {
        advisor,
        isAppointmentSaving,
        selectedVehicle,
        valueService,
        serviceTypeOption,
        appointmentByKey
    } = useSelector((state: RootState) => state.appointmentFrame)
    const {
        serviceValetAppointment,
        appointment,
        scProfile,
        waitListSettings,
        customerLoadedData
    } = useSelector((state: RootState) => state.appointment)
    const {t} = useTranslation();
    const { engineTypes } = useSelector((state: RootState) => state.vehicleDetails)
    const [serviceValetTime, setServiceValetTime] = useState<TServiceValetSlot|null>(null);

    const engine = useMemo(() => engineTypes.find(item => item.id === Number(selectedVehicle?.engineTypeId)), [engineTypes, selectedVehicle])

    const isServiceValetApp = useMemo(() => Boolean(serviceValetAppointment) && serviceTypeOption?.type === EServiceType.PickUpDropOff,
        [serviceValetAppointment, serviceTypeOption]);

    const isWaitList = useMemo(() => waitListSettings?.isEnabled && (appointment?.isOverbookingApplied || appointmentByKey?.isWaitlist),
        [waitListSettings, appointment, appointmentByKey])

    const vehicleData = useMemo(() => {
        return selectedVehicle?.year
            ? `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model} ${engine?.name ?? ""}`
            : valueService?.year
                ? `${valueService?.year?.year} BMW ${valueService?.series?.name} ${valueService?.model?.name}`
                : ''
    }, [selectedVehicle, engine, valueService])

    useEffect(() => {
        if (serviceValetAppointment) {
            setServiceValetTime({
                pickUpMin: serviceValetAppointment.pickUpMin,
                pickUpMax: serviceValetAppointment.pickUpMax,
                dropOffMin: serviceValetAppointment.dropOffMin,
                dropOffMax: serviceValetAppointment.dropOffMax,
            })
        } else if (appointmentByKey?.serviceValetTime) {
            const {serviceValetTime} = appointmentByKey;
            setServiceValetTime({
                pickUpMin: serviceValetTime.pickUpMin,
                pickUpMax: serviceValetTime.pickUpMax,
                dropOffMin: serviceValetTime.dropOffMin,
                dropOffMax: serviceValetTime.dropOffMax,
            })
        }
    }, [serviceValetAppointment, appointmentByKey])

    const getDateForUpdate = (): moment.Moment => {
        if (customerLoadedData?.isUpdating && appointmentByKey) {
            if (appointmentByKey?.serviceTypeOption?.type === EServiceType.PickUpDropOff) {
                return moment.utc(appointmentByKey.dateInUtc)
            } else {
                const [hh, mm] = appointmentByKey.timeSlot.split(':')
                return moment.utc(appointmentByKey.dateInUtc).set('hour', +hh).set('minute', +mm)
            }
        }
        return moment()
    }

    const date = isServiceValetApp
        ? moment.utc(serviceValetAppointment?.date)
        : customerLoadedData?.isUpdating && appointmentByKey
            ? appointment?.date
                ? moment.utc(appointment?.date)
                : getDateForUpdate()
            : moment.utc(appointment?.date)

    const getDateForCalendar = useCallback(() => {
        let dateString: string;
        if (isServiceValetApp) {
            dateString = moment(date).format(calendarDateFormat);
            const pickUpTime = `${t("Pick Up Time")}: ${moment.utc(serviceValetAppointment?.pickUpMin, timeSpanString)
                .format(time24HourFormat)} ${t("to")} ${moment.utc(serviceValetAppointment?.pickUpMax, timeSpanString).format(time24HourFormat)}`
            dateString = dateString.concat('\n')
            dateString = dateString.concat(pickUpTime)
        } else {
            if (serviceTypeOption?.type === EServiceType.PickUpDropOff && appointmentByKey?.serviceTypeOption?.type === EServiceType.PickUpDropOff) {
                dateString = moment(date).format(calendarDateFormat);
                const pickUpMin = appointmentByKey?.serviceValetTime?.pickUpMin;
                const pickUpMax = appointmentByKey?.serviceValetTime?.pickUpMax;
                if (pickUpMin && pickUpMax) {
                    const pickUpTime = `${t("Pick Up Time")}: ${moment.utc(pickUpMin, timeSpanString)
                        .format(time24HourFormat)} ${t("to")} ${moment.utc(pickUpMax, timeSpanString).format(time24HourFormat)}`
                    dateString = dateString.concat('\n')
                    dateString = dateString.concat(pickUpTime)
                }
            } else {
                dateString = date.format(dateTimeString) ?? moment.utc().format(dateTimeString);
            }
        }
        return dateString;
    }, [isServiceValetApp, serviceValetAppointment, appointment, date, appointmentByKey, serviceTypeOption, waitListSettings])

    const calendarData: TItem[] = useMemo(() => {
        const data = [
            {
                label: t('VEHICLE DETAILS'),
                content: vehicleData,
            },
            {
                label: t('SERVICE OPTION'),
                content: serviceName
            },
            {
                label: t('SELECTED DATE & TIME'),
                content: isWaitList
                    ? `${getDateForCalendar()}\n${waitListSettings?.text ?? t("Waitlist Only")}`
                    : getDateForCalendar(),
            },
            {
                label: t('SERVICE REQUESTS'),
                content: servicesList.map(item => item.includes('Going') ? t('My Description Of Need') : item).join(', '),
            },
            {
                label: t('APPOINTMENT DETAILS'),
                content: `Service Advisor: ${advisor?.name ?? t('Any Advisor')}`
            },
            {
                label: t('DEALERSHIP CONTACT NUMBER'),
                content: scProfile?.phoneNumber ?? '',
            }
        ];
        if (serviceTypeOption?.type === EServiceType.MobileService) {
            const advisorIndex = data.findIndex(el => el.label === t('APPOINTMENT DETAILS'))
            if (advisorIndex > -1) data.splice(advisorIndex, 1);
        }
        return data
    }, [vehicleData, serviceName, getDateForCalendar, isServiceValetApp, servicesList, advisor, scProfile, serviceTypeOption, getDateForCalendar])

    const handleAddToCalendar = () => {
        const dateFrom = date.format(G_CALENDAR_FORMAT) + `${isServiceValetApp 
            ? serviceValetTime?.pickUpMin.split(":").join('') ?? "000000" 
            : appointment?.time.split(":").join("")}`;
        const dateTo = date.add(1, "hour").format(G_CALENDAR_FORMAT) + `${isServiceValetApp 
            ? serviceValetTime?.pickUpMax?.split(":").join('') ?? "000000" 
            : appointment?.time.split(":").join("")}`;
        const url = getCalendarUrl({
            dates: [dateFrom, dateTo],
            text: `${scProfile?.name} ${t("Service Appointment")}`,
            location: scProfile?.address ? concatAddress(scProfile?.address) : "",
            details: calendarData.map(r => `${r.label}:\n${r.content}`).join("\n \n"),
        });
        window.open(url);
    }

    return (
        <Button color="primary" onClick={handleAddToCalendar} fullWidth variant="contained" disabled={isAppointmentSaving}>
            {t("Add to Calendar")}
        </Button>
    );
};

export default AddToCalendarButton;