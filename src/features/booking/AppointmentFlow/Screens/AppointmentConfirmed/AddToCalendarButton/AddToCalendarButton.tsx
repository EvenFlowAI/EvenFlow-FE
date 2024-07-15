import React, {useCallback, useMemo} from 'react';
import {Button} from "@mui/material";
import {concatAddress} from "../../../../../../utils/utils";
import {
    calendarDateFormat,
    dateTimeString,
    G_CALENDAR_FORMAT,
    time24HourFormat,
    timeSpanString
} from "../../../../../../utils/constants";
import {EServiceType} from "../../../../../../store/reducers/appointmentFrameReducer/types";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../../store/rootReducer";
import {TItem} from "../types";
import {getCalendarUrl} from "./utils";
import dayjs from "dayjs";
import {TParsableDate} from "../../../../../../types/types";

type TProps = {
    serviceName: string,
    servicesList: string[],
}

const AddToCalendarButton: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({ serviceName, servicesList}) => {
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

    const getDateForUpdate = (): TParsableDate => {
        if (customerLoadedData?.isUpdating && appointmentByKey) {
            if (appointmentByKey?.serviceTypeOption?.type === EServiceType.PickUpDropOff) {
                return dayjs.utc(appointmentByKey.dateInUtc)
            } else {
                const [hh, mm] = appointmentByKey.timeSlot.split(':')
                return dayjs.utc(appointmentByKey.dateInUtc).set('hour', +hh).set('minute', +mm)
            }
        }
        return dayjs()
    }

    const date = isServiceValetApp
        ? dayjs.utc(serviceValetAppointment?.date)
        : customerLoadedData?.isUpdating && appointmentByKey
            ? appointment?.date
                ? dayjs.utc(appointment?.date)
                : getDateForUpdate()
            : dayjs.utc(appointment?.date)

    const getDateForCalendarHeader = (): string[] => {
        let dateFrom = dayjs.utc(date).format(G_CALENDAR_FORMAT);
        let dateTo = dayjs.utc(date).add(1, "hour").format(G_CALENDAR_FORMAT);
        if (isServiceValetApp) {
            dateFrom = dateFrom + serviceValetAppointment?.pickUpMin.split(":").join("");
            dateTo = dateTo + serviceValetAppointment?.pickUpMax.split(":").join("");
        } else {
            if (serviceTypeOption?.type === EServiceType.PickUpDropOff
                && appointmentByKey?.serviceTypeOption?.type === EServiceType.PickUpDropOff) {
                const pickUpMin = appointmentByKey?.serviceValetTime?.pickUpMin;
                const pickUpMax = appointmentByKey?.serviceValetTime?.pickUpMax;
                if (pickUpMin && pickUpMax) {
                    dateFrom = dateFrom + pickUpMin.split(":").join("")
                    dateTo = dateTo + pickUpMax.split(":").join("");
                }
            } else {
                dateFrom = dateFrom + dayjs.utc(date).format("HHmmss")
                dateTo = dateTo + dayjs.utc(date).add(1, "hour").format("HHmmss")
            }
        }
        return [dateFrom, dateTo]
    }

    const getDateForCalendarDetails = useCallback(() => {
        let dateString: string;
        if (isServiceValetApp) {
            dateString = dayjs(date).format(calendarDateFormat);
            const pickUpTime = `${t("Pick Up Time")}: ${dayjs.utc(serviceValetAppointment?.pickUpMin, timeSpanString)
                .format(time24HourFormat)} ${t("to")} ${dayjs.utc(serviceValetAppointment?.pickUpMax, timeSpanString).format(time24HourFormat)}`
            dateString = dateString.concat('\n')
            dateString = dateString.concat(pickUpTime)
        } else {
            if (serviceTypeOption?.type === EServiceType.PickUpDropOff && appointmentByKey?.serviceTypeOption?.type === EServiceType.PickUpDropOff) {
                dateString = dayjs(date).format(calendarDateFormat);
                const pickUpMin = appointmentByKey?.serviceValetTime?.pickUpMin;
                const pickUpMax = appointmentByKey?.serviceValetTime?.pickUpMax;
                if (pickUpMin && pickUpMax) {
                    const pickUpTime = `${t("Pick Up Time")}: ${dayjs.utc(pickUpMin, timeSpanString)
                        .format(time24HourFormat)} ${t("to")} ${dayjs.utc(pickUpMax, timeSpanString).format(time24HourFormat)}`
                    dateString = dateString.concat('\n')
                    dateString = dateString.concat(pickUpTime)
                }
            } else {
                dateString = dayjs(date).format(dateTimeString) ?? dayjs.utc().format(dateTimeString);
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
                    ? `${getDateForCalendarDetails()}\n${waitListSettings?.text ?? t("Waitlist Only")}`
                    : getDateForCalendarDetails(),
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
    }, [vehicleData, serviceName, getDateForCalendarDetails, isServiceValetApp, servicesList, advisor, scProfile, serviceTypeOption, getDateForCalendarDetails])

    const handleAddToCalendar = () => {
        const [dateFrom, dateTo] = getDateForCalendarHeader();
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