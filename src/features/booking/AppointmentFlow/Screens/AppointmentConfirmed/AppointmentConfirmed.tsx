import React, {useCallback, useEffect, useMemo} from 'react';
import ReactGA from 'react-ga4';
import {StepWrapper} from "../../../../../components/styled/StepWrapper";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {concatAddress, getMaintenanceDescription} from "../../../../../utils/utils";
import {TArgCallback} from "../../../../../types/types";
import {EServiceType} from "../../../../../store/reducers/appointmentFrameReducer/types";
import {useTranslation} from "react-i18next";
import {setWelcomeScreenView} from "../../../../../store/reducers/appointmentFrameReducer/actions";
import {ILoadedVehicle} from "../../../../../api/types";
import {Loading} from "../../../../../components/wrappers/Loading/Loading";
import AddToCalendarButton from "./AddToCalendarButton/AddToCalendarButton";
import ModifyButton from "./ModifyButton/ModifyButton";
import MakeNewButton from "./MakeNewButton/MakeNewButton";
import {ButtonsWrapper, Divider, Paper, Wrapper} from "./styles";
import {TItem} from "./types";
import {getAddressLabel, getServiceName} from "./utils";
import {calendarDateFormat, dateTimeString, time24HourFormat, timeSpanString} from "../../../../../utils/constants";
import dayjs from "dayjs";
import {ESettingType} from "../../../../../store/reducers/generalSettings/types";
import {EPricingDisplayType} from "../../../../../store/reducers/pricingSettings/types";

type TProps = {
    onUpdateAppointment: TArgCallback<ILoadedVehicle>;
    isManagingFlow: boolean
}

export const AppointmentConfirmed: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({isManagingFlow, onUpdateAppointment}) => {
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
        trackerData
    } = useSelector((state: RootState) => state.appointmentFrame)
    const {allCategories} = useSelector((state: RootState) => state.categories)
    const {engineTypes} = useSelector((state: RootState) => state.vehicleDetails)
    const {settings} = useSelector((state: RootState) => state.generalSettings);
    const companyNameIsOn = useMemo(() => {
        return settings.find(el => el.settingType === ESettingType.CompanyName)?.data?.isOn
    }, [settings])

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
        ? [
            <div>{selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}</div>,
            engine?.name ? <div>{engine.name}</div> : <div/>,
            selectedVehicle.vin ? <div>{selectedVehicle.vin}</div> : <div/>
]
        : valueService?.year
            ? `${valueService?.year?.year} BMW ${valueService?.series?.name} ${valueService?.model?.name}`
            : ''

    const isServiceValetApp = useMemo(() => Boolean(serviceValetAppointment) && serviceTypeOption?.type === EServiceType.PickUpDropOff,
        [serviceValetAppointment, serviceTypeOption]);
    const isServiceValetManage = useMemo(() => !Boolean(appointment) && serviceTypeOption?.type === EServiceType.PickUpDropOff && appointmentByKey,
        [appointment, serviceTypeOption]);
    const {appointmentRequestsPrices} = useSelector((state: RootState) => state.appointmentFrame);

    const noDefinedPriceExists = useMemo(() => {
            if (isManagingFlow) {
                return appointmentRequestsPrices.find(el => !el.priceValue || el.pricingDisplayType === EPricingDisplayType.Suppressed)
            } else {
                if (serviceValetAppointment && serviceTypeOption?.type === EServiceType.PickUpDropOff) {
                    return serviceValetAppointment?.serviceRequestPrices
                        ?.find(item => !item.priceValue || item.pricingDisplayType === EPricingDisplayType.Suppressed)
                }
                return appointment?.serviceRequestPrices
                    ?.find(item => !item.priceValue || item.pricingDisplayType === EPricingDisplayType.Suppressed)
            }
        },
        [appointment, serviceValetAppointment, serviceTypeOption, isManagingFlow, appointmentRequestsPrices])

    useEffect(() => {
        ReactGA.event({
            category: 'EvenFlow User',
            action: 'Created Appointment',
            nonInteraction: true,
        }, trackerData.ids)
        dispatch(setWelcomeScreenView("select"));
    }, [dispatch, trackerData])

    const getAddress = (): string => {
        if (serviceType === EServiceType.VisitCenter) {
            return scProfile?.address ? concatAddress(scProfile?.address) : ""
        } else {
            return address ? `${typeof address === 'string' ? address : address?.label ?? ""} ${zipCode ? zipCode : ""}` : ""
        }
    }

    const getPriceContent = (): string => {
        let price  = t('Will be quoted at the dealership');
        if (noDefinedPriceExists) return t("A full quote will be provided at the dealership");

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
        let date = dayjs.utc().format(dateTimeString);
        if (isServiceValetApp) {
            date =  dayjs.utc(serviceValetAppointment?.date).format(calendarDateFormat)
        } else if (appointment) {
            date = dayjs(appointment?.date).format(dateTimeString)
        } else if (appointmentByKey?.dateInUtc) {
            if (appointmentByKey.serviceTypeOption?.type === EServiceType.PickUpDropOff) {
                date = dayjs(appointmentByKey.dateInUtc).utc().format(calendarDateFormat)
            } else {
                const [hh, mm] = appointmentByKey.timeSlot.split(":")
                date = dayjs(appointmentByKey.dateInUtc).utc().set('hour', +hh).set('minute', +mm).format(dateTimeString)
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
                    content: `${dayjs.utc(serviceValetAppointment?.pickUpMin, timeSpanString).format(time24HourFormat)}
            ${t("to")} ${dayjs.utc(serviceValetAppointment?.pickUpMax, timeSpanString).format(time24HourFormat)}`
                }
            )
            if (dropOffSettings?.showDropOffTime && serviceValetAppointment?.dropOffMin && serviceValetAppointment?.dropOffMax) {
                list.splice(2, 0, {
                    label: t("Drop Off Time"),
                    content: `${dayjs.utc(serviceValetAppointment?.dropOffMin, timeSpanString).format(time24HourFormat)}
            ${t("to")} ${dayjs.utc(serviceValetAppointment?.dropOffMax, timeSpanString).format(time24HourFormat)}`
                })
            }
        } else if (isServiceValetManage) {
            list.splice(
                1,
                0,
                {
                    label: t("Pick Up Time"),
                    content: `${dayjs.utc(appointmentByKey?.serviceValetTime?.pickUpMin, timeSpanString).format(time24HourFormat)}
            ${t("to")} ${dayjs.utc(appointmentByKey?.serviceValetTime?.pickUpMax, timeSpanString).format(time24HourFormat)}`
                }
            )
            if (dropOffSettings?.showDropOffTime && appointmentByKey?.serviceValetTime?.dropOffMin && appointmentByKey?.serviceValetTime?.dropOffMax) {
                list.splice(2, 0, {
                    label: t("Drop Off Time"),
                    content: `${dayjs.utc(appointmentByKey?.serviceValetTime?.dropOffMin, timeSpanString).format(time24HourFormat)}
            ${t("to")} ${dayjs.utc(appointmentByKey?.serviceValetTime?.dropOffMax, timeSpanString).format(time24HourFormat)}`
                })
            }
        }
        return list;
    }, [isServiceValetApp, serviceValetAppointment, dropOffSettings, isServiceValetManage, appointmentByKey])

    const data: TItem[] = useMemo(() => {
        const isWaitListCreated = appointment?.isOverbookingApplied
            && waitListSettings?.isEnabled
            && serviceType === EServiceType.VisitCenter
        const isWaitListManaged = appointmentByKey?.isWaitlist
            && appointmentByKey?.waitlistTextSettings?.isEnabled
            && serviceType === EServiceType.VisitCenter
        const isWaitList =  appointment ? isWaitListCreated : isWaitListManaged;
        const list: TItem[] = [
            {
                label: isServiceValetApp || isServiceValetManage
                    ? t("Date")
                    : t("Date and time"),
                content: isWaitList
                    ? [
                        <div key={getDate()}>{getDate()}</div>,
                        <div key="textWaitList"
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
                label: t("Company Name"),
                content: companyNameIsOn && customer.companyName ? customer.companyName : ''
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
        isServiceValetApp, isServiceValetManage, insertPickUpTime, serviceName, serviceType, waitListSettings, appointmentByKey,
        companyNameIsOn]);

    return <StepWrapper>
        <Paper>
            <Wrapper>
                <h2>Appointment Confirmed!</h2>
                {isAppointmentSaving
                    ? <div className="emptyContainer"><Loading/></div>
                    : data.filter(el => el.content).map((item, index) => {
                    if (!item.label.length && item.content.length) return null;
                    return <div className="item" key={item.label + index}>
                        <div className="label">{item.label}</div>
                        <div className="content">{item.content}</div>
                    </div>;
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