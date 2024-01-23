import React, {useCallback, useEffect, useMemo} from 'react';
import ReactGA from 'react-ga4';
import {StepWrapper} from "../../../../components/styled/StepWrapper";
import moment from "moment";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {concatAddress, getMaintenanceDescription} from "../../../../utils/utils";
import {TArgCallback} from "../../../../types/types";
import {EServiceType} from "../../../../store/reducers/appointmentFrameReducer/types";
import {useTranslation} from "react-i18next";
import {setWelcomeScreenView} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {ILoadedVehicle} from "../../../../api/types";
import {Loading} from "../../../../components/wrappers/Loading/Loading";
import AddToCalendarButton from "./AddToCalendarButton/AddToCalendarButton";
import ModifyButton from "./ModifyButton/ModifyButton";
import MakeNewButton from "./MakeNewButton/MakeNewButton";
import {ButtonsWrapper, Divider, Paper, Wrapper} from "./styles";
import {TItem} from "./types";
import {getAddressLabel, getServiceName} from "./utils";
import {calendarDateFormat, dateTimeString, time24HourFormat, timeSpanString} from "../../../../utils/constants";

type TProps = {
    onUpdateAppointment: TArgCallback<ILoadedVehicle>;
}

export const AppointmentConfirmed: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({onUpdateAppointment}) => {
    const {
        appointment,
        serviceValetAppointment,
        serviceRequests,
        selectedSR,
        scProfile,
        dropOffSettings,
        waitListSettings,
    } = useSelector((state: RootState) => state.appointment)
    const {
        service,
        subService,
        selectedPackage,
        packagePricingType,
        packageEMenuType,
        customer,
        selectedVehicle,
        categoriesIds,
        serviceTypeOption,
        address,
        zipCode,
        valueService,
        selectedRecalls,
        packagePriceTitles,
        isAppointmentSaving,
        appointmentByKey,
        transactionValue,
    } = useSelector((state: RootState) => state.appointmentFrame)
    const {allCategories} = useSelector((state: RootState) => state.categories)
    const {engineTypes} = useSelector((state: RootState) => state.vehicleDetails)

    const {t} = useTranslation();
    const dispatch = useDispatch();

    const serviceType = useMemo(() => serviceTypeOption
        ? serviceTypeOption.type
        : EServiceType.VisitCenter, [serviceTypeOption]);
    const servicesList = useMemo(() => {
            return getMaintenanceDescription(
                serviceRequests,
                selectedRecalls,
                packagePriceTitles,
                selectedSR,
                selectedPackage,
                allCategories,
                categoriesIds,
                valueService,
                packagePricingType,
                packageEMenuType,
                scProfile?.maintenancePackageOptionTypes
            )
        },
        [serviceRequests, selectedSR, selectedRecalls, selectedPackage, allCategories, packagePriceTitles, categoriesIds,
            valueService, packagePricingType, packageEMenuType, scProfile])

    const engine = useMemo(() => engineTypes.find(item => item.id === Number(selectedVehicle?.engineTypeId)), [engineTypes, selectedVehicle])

    const serviceName = useMemo(() => getServiceName(serviceTypeOption, serviceType), [serviceTypeOption, serviceType])

    const vehicleData = selectedVehicle?.year
        ? `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model} ${engine?.name ?? ""}`
        : valueService?.year
            ? `${valueService?.year?.year} BMW ${valueService?.series?.name} ${valueService?.model?.name}`
            : ''

    const isServiceValetApp = useMemo(() => Boolean(serviceValetAppointment) && serviceTypeOption?.type === EServiceType.PickUpDropOff,
        [serviceValetAppointment, serviceTypeOption]);
    const isServiceValetManage = useMemo(() => !Boolean(appointment) && serviceTypeOption?.type === EServiceType.PickUpDropOff && appointmentByKey,
        [appointment, serviceTypeOption]);

    useEffect(() => {
        ReactGA.event({
            category: 'EvenFlow User',
            action: 'Created Appointment',
            nonInteraction: true,
        })
        dispatch(setWelcomeScreenView("select"));
    }, [dispatch])

    const getAddress = (): string => {
        if (serviceType === EServiceType.VisitCenter) {
            return scProfile?.address ? concatAddress(scProfile?.address) : ""
        } else {
            return address ? `${typeof address === 'string' ? address : address?.label ?? ""} ${zipCode ? zipCode : ""}` : ""
        }
    }

    const getPriceContent = (): string => {
        let price  = t('Will be quoted at the dealership');
        if (!Number.isNaN(transactionValue) && transactionValue > 0) {
            price = scProfile?.isRoundPrice
                ? `$${transactionValue}`
                : `$${transactionValue.toFixed(2)}`
        } else if (isServiceValetApp && serviceValetAppointment?.price?.value) {
            price = scProfile?.isRoundPrice
                ? `$${serviceValetAppointment?.price?.value}`
                : `$${serviceValetAppointment?.price?.value.toFixed(2)}`
        } else if (appointment?.price?.value) {
            price = scProfile?.isRoundPrice
                ? `$${appointment?.price?.value}`
                : `$${appointment?.price?.value.toFixed(2)}`
        }
        return price
    }

    const getDate = () => {
        let date = moment.utc().format(dateTimeString);
        if (isServiceValetApp) {
            date =  moment.utc(serviceValetAppointment?.date).format(calendarDateFormat)
        } else if (appointment) {
            date = appointment?.date.format(dateTimeString)
        } else if (appointmentByKey?.dateInUtc) {
            if (appointmentByKey.serviceTypeOption?.type === EServiceType.PickUpDropOff) {
                date = moment(appointmentByKey.dateInUtc).utc().format(calendarDateFormat)
            } else {
                const [hh, mm] = appointmentByKey.timeSlot.split(":")
                date = moment(appointmentByKey.dateInUtc).utc().set('hour', +hh).set('minute', +mm).format(dateTimeString)
            }
        }
        return date;
    }

    const insertPickUpTime = useCallback((list: TItem[]): TItem[] => {
        if (isServiceValetApp) {
            list.splice(
                1,
                0,
                {
                    label: t("Pick Up Time"),
                    content: `${moment.utc(serviceValetAppointment?.pickUpMin, timeSpanString).format(time24HourFormat)}
            ${t("to")} ${moment.utc(serviceValetAppointment?.pickUpMax, timeSpanString).format(time24HourFormat)}`
                }
            )
            if (dropOffSettings?.showDropOffTime && serviceValetAppointment?.dropOffMin && serviceValetAppointment?.dropOffMax) {
                list.splice(2, 0, {
                    label: t("Drop Off Time"),
                    content: `${moment.utc(serviceValetAppointment?.dropOffMin, timeSpanString).format(time24HourFormat)}
            ${t("to")} ${moment.utc(serviceValetAppointment?.dropOffMax, timeSpanString).format(time24HourFormat)}`
                })
            }
        } else if (isServiceValetManage) {
            list.splice(
                1,
                0,
                {
                    label: t("Pick Up Time"),
                    content: `${moment.utc(appointmentByKey?.serviceValetTime?.pickUpMin, timeSpanString).format(time24HourFormat)}
            ${t("to")} ${moment.utc(appointmentByKey?.serviceValetTime?.pickUpMax, timeSpanString).format(time24HourFormat)}`
                }
            )
            if (dropOffSettings?.showDropOffTime && appointmentByKey?.serviceValetTime?.dropOffMin && appointmentByKey?.serviceValetTime?.dropOffMax) {
                list.splice(2, 0, {
                    label: t("Drop Off Time"),
                    content: `${moment.utc(appointmentByKey?.serviceValetTime?.dropOffMin, timeSpanString).format(time24HourFormat)}
            ${t("to")} ${moment.utc(appointmentByKey?.serviceValetTime?.dropOffMax, timeSpanString).format(time24HourFormat)}`
                })
            }
        }
        return list;
    }, [isServiceValetApp, serviceValetAppointment, dropOffSettings, isServiceValetManage, appointmentByKey])

    const data: TItem[] = useMemo(() => {
        let isWaitList: boolean|undefined = false;
        if (waitListSettings?.isEnabled) {
            isWaitList = appointment
                ? appointment?.isOverbookingApplied
                : appointmentByKey?.isWaitlist && serviceType === EServiceType.VisitCenter
        }
        const list: TItem[] = [
            {
                label: isServiceValetApp || isServiceValetManage
                    ? t("Date")
                    : t("Date and time"),
                content: isWaitList
                    ? [
                        <div>{getDate()}</div>,
                        <div
                            style={{
                                color: waitListSettings?.textHex
                                    ? `#${waitListSettings?.textHex}`
                                    : "#CE690B",
                                marginTop: 12}}>
                            {waitListSettings?.text ?? t("Waitlist only")}
                        </div>
                    ]
                    : getDate(),
            },
            {
                label: serviceType !== EServiceType.VisitCenter ? t("Location of service") : "",
                content: serviceType !== EServiceType.VisitCenter ? serviceName : ""
            },
            {
                label: getAddressLabel(serviceType),
                content: getAddress(),
            },
            {
                label: servicesList?.length > 1 ? t("Services type") : t("Service type"),
                content: servicesList.map(item => <div>{item}</div>)
            },
            {
                label: t("Selected Price"),
                content: getPriceContent(),
            },
            {
                label: t("Name"),
                content: customer.fullName
            },
            {
                label: t("Vehicle"),
                content: vehicleData,
            },
            {
                label: t("Phone number"),
                content: customer.phoneNumber
            },
            {
                label: t("Email"),
                content: customer.email
            },
        ]

        return insertPickUpTime(list);
    }, [ appointment, scProfile, service, subService, customer, selectedVehicle, serviceRequests, selectedPackage, selectedSR,
        isServiceValetApp, isServiceValetManage, insertPickUpTime, serviceName, serviceType, waitListSettings, appointmentByKey]);

    return <StepWrapper>
        <Paper>
            <Wrapper>
                <h2>Appointment Confirmed!</h2>
                {isAppointmentSaving
                    ? <div className="emptyContainer"><Loading/></div>
                    : data.filter(el => el.content).map((item, index) => {
                    if (!item.label.length && item.content.length) return null;
                    return <React.Fragment key={item.label + index}>
                        <div className="label">{item.label}</div>
                        <div>{item.content}</div>
                    </React.Fragment>;
                })}
            </Wrapper>
            <ButtonsWrapper>
                <ModifyButton onUpdateAppointment={onUpdateAppointment}/>
                <AddToCalendarButton servicesList={servicesList} serviceName={serviceName}/>
                <Divider />
            </ButtonsWrapper>
           <MakeNewButton/>
            <h3>{t("We will see you soon!")}</h3>
        </Paper>
    </StepWrapper>
};