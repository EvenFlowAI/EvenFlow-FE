import React, {useCallback, useMemo} from 'react';
import {Button} from "@material-ui/core";
import {concatAddress, getCalendarUrl} from "../../../../utils/utils";
import {G_CALENDAR_FORMAT} from "../../../../config/constants";
import moment from "moment";
import {EServiceType} from "../../../../store/reducers/appointmentFrameReducer/types";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";

type TItem = {
    label: string;
    content: string|JSX.Element[];
}

type TProps = {
    date: moment.Moment,
    serviceName: string,
    servicesList: string[],
}

const AddToCalendarButton: React.FC<TProps> = ({date, serviceName, servicesList}) => {
    const {
        advisor,
        isAppointmentSaving,
        selectedVehicle,
        valueService,
        serviceTypeOption,
        appointmentByKey
    } = useSelector((state: RootState) => state.appointmentFrame)
    const { engineTypes } = useSelector((state: RootState) => state.vehicleDetails)
    const { serviceValetAppointment, appointment, scProfile, waitListSettings } = useSelector((state: RootState) => state.appointment)
    const {t} = useTranslation();
    const engine = useMemo(() => engineTypes.find(item => item.id === Number(selectedVehicle?.engineTypeId)), [engineTypes, selectedVehicle])

    const isServiceValetApp = useMemo(() => Boolean(serviceValetAppointment) && serviceTypeOption?.type === EServiceType.PickUpDropOff,
        [serviceValetAppointment, serviceTypeOption]);

    const isWaitList = useMemo(() => waitListSettings && (appointment?.isOverbookingApplied || appointmentByKey?.isWaitlist),
        [waitListSettings, appointment, appointmentByKey])

    const vehicleData = selectedVehicle?.year
        ? `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model} ${engine?.name ?? ""}`
        : valueService?.year
            ? `${valueService?.year?.year} BMW ${valueService?.series?.name} ${valueService?.model?.name}`
            : ''

    const getDateForCalendar = useCallback(() => {
        let dateString: string = '';
        if (isServiceValetApp) {
            dateString = moment(date).format('ddd, MMM D');
            const pickUpTime = `${t("Pick Up Time")}: ${moment.utc(serviceValetAppointment?.pickUpMin, "HH:mm:ss").format('hh:mm A')} ${t("to")} ${moment.utc(serviceValetAppointment?.pickUpMax, "HH:mm:ss").format('hh:mm A')}`
            dateString = dateString.concat('\n')
            dateString = dateString.concat(pickUpTime)
        } else {
            if (serviceTypeOption?.type === EServiceType.PickUpDropOff && appointmentByKey?.serviceTypeOption?.type === EServiceType.PickUpDropOff) {
                dateString = moment(date).format('ddd, MMM D');
                const pickUpMin = appointmentByKey?.serviceValetTime?.pickUpMin;
                const pickUpMax = appointmentByKey?.serviceValetTime?.pickUpMax;
                if (pickUpMin && pickUpMax) {
                    const pickUpTime = `${t("Pick Up Time")}: ${moment.utc(pickUpMin, "HH:mm:ss").format('hh:mm A')} ${t("to")} ${moment.utc(pickUpMax, "HH:mm:ss").format('hh:mm A')}`
                    dateString = dateString.concat('\n')
                    dateString = dateString.concat(pickUpTime)
                }
            } else {
                dateString = date.format('ddd, MMM D, h:mm A') ?? moment.utc().format('ddd, MMM D, h:mm A');
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
        const url = getCalendarUrl({
            dates: [
                date.format(G_CALENDAR_FORMAT) + `${isServiceValetApp ? "000000" : appointment?.time.split(":").join("")}`,
                date.add(1, "hour").format(G_CALENDAR_FORMAT) + `${isServiceValetApp ? "000000" : appointment?.time.split(":").join("")}`],
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