import React, {useMemo} from 'react';
import {EServiceType, IAncillaryByZipRequest,} from "../../../../../../../store/reducers/appointmentFrameReducer/types";
import {MenuItem, Select, SelectChangeEvent, useMediaQuery, useTheme} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../../../store/rootReducer";
import {useTranslation} from "react-i18next";
import {
    selectAppointment,
    selectServiceValetAppointment,
} from "../../../../../../../store/reducers/appointment/actions";
import {
    checkCarIsValid,
    loadAncillaryPriceByZip,
    loadConsultants,
    setAdvisor,
    setCurrentFrameScreen,
    setServiceOptionChanged,
    setServiceTypeOption,
    setSideBarSteps,
    setTransportation
} from "../../../../../../../store/reducers/appointmentFrameReducer/actions";
import {useParams} from "react-router-dom";
import {IFirstScreenOption} from "../../../../../../../store/reducers/serviceTypes/types";
import {setAdvisorAvailable} from "../../../../../../../store/reducers/bookingFlowConfig/actions";
import {IServiceConsultant} from "../../../../../../../api/types";
import {useSelectedAppointmentStyles} from "../../../../../../../hooks/styling/useSelectedAppointmentStyles";
import {useException} from "../../../../../../../hooks/useException/useException";
import {setUnavailableServiceOpen} from "../../../../../../../store/reducers/modals/actions";
import {TArgCallback, TScreen} from "../../../../../../../types/types";

type TProps = {
    isSm: boolean;
    handleSetScreen: TArgCallback<TScreen>;
}

const ServiceOption: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({isSm, handleSetScreen}) => {
    const {
        serviceTypeOption,
        sideBarSteps,
        serviceOptionChangedFromSlotPage,
        address,
        zipCode,
        selectedServiceOptions,
        advisor,
        transportation
    } = useSelector((state: RootState) => state.appointmentFrame);
    const { firstScreenOptions } = useSelector((state: RootState) => state.serviceTypes);
    const { scProfile, appointment, serviceValetAppointment } = useSelector(({appointment}: RootState) => appointment);
    const { config } = useSelector((state: RootState) => state.bookingFlowConfig);

    const {t} = useTranslation();
    const { classes  } = useSelectedAppointmentStyles();
    const dispatch = useDispatch();
    const showError = useException();
    const {id} = useParams<{id: string}>();
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("mdl"))

    const serviceType = useMemo(() => serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter, [serviceTypeOption]);
    const serviceValetIsPossibleToUse = useMemo(() => {
        return serviceTypeOption?.type !== EServiceType.MobileService
            && firstScreenOptions.find(op => op.type === EServiceType.PickUpDropOff)
            && config.find(item => item.serviceType === EServiceType.PickUpDropOff && item.available)
    }, [serviceTypeOption, firstScreenOptions, config]);

    const getServiceName = () => {
        if (serviceTypeOption?.name) return serviceTypeOption.name
        switch (serviceType) {
            case EServiceType.MobileService:
                return t("Mobile Service");
            case EServiceType.PickUpDropOff:
                return t("Pick Up / Drop Off Service");
            default:
                return t("Visit Center");
        }
    }

    const sliceSteps = (index: number) => {
        if (index > -1) {
            const slicedSteps = sideBarSteps.slice(0, index + 1);
            dispatch(setSideBarSteps(slicedSteps))
        }
    }

    const handleSideBar = (showAdvisorScreen: boolean) => {
        const index = sideBarSteps.indexOf(showAdvisorScreen ? "consultantSelection" : "appointmentSelection");
        if (index > -1) {
            sliceSteps(index)
        } else {
            if (showAdvisorScreen) {
                const index = sideBarSteps.indexOf("appointmentSelection")
                sliceSteps(index)
            }
        }
    }

    const handleAdvisorSelection = (showAdvisorScreen: boolean) => {
        handleSideBar(showAdvisorScreen);
        if (showAdvisorScreen) dispatch(setCurrentFrameScreen('consultantSelection'))
    }

    const redirectToLocation = () => {
        dispatch(setCurrentFrameScreen("location"))
        dispatch(setSideBarSteps([]))
    }

    const onUnavailableService = () => {
        redirectToLocation()
        dispatch(setUnavailableServiceOpen(true))
    }

    const onValidZip = (option: IFirstScreenOption, showAdvisorScreen: boolean) => {
        const optionWasSelectedPreviously = selectedServiceOptions.find(el => el.id === option.id);
        if (!serviceOptionChangedFromSlotPage || !optionWasSelectedPreviously) {
            redirectToLocation()
        }
        handleAdvisorSelection(showAdvisorScreen)
    }

    const checkAncillaryPriceByZip = (option: IFirstScreenOption, showAdvisorScreen: boolean) => {
        if (scProfile && address && zipCode){
            const data: IAncillaryByZipRequest = {
                address: typeof address === 'string' ? address : address.label,
                zipCode: zipCode,
                serviceCenterId: scProfile.id,
                serviceTypeOptionId: option.id,
            }
            dispatch(loadAncillaryPriceByZip(data, () => onValidZip(option, showAdvisorScreen), showError, onUnavailableService))
        }
    }

    const onRedirectToLocation = (option: IFirstScreenOption, showAdvisorScreen: boolean) => {
        const optionWasSelectedPreviously = selectedServiceOptions.find(el => el.id === option.id);
        const shouldRedirectToLocation = !address || !zipCode || !serviceOptionChangedFromSlotPage || !optionWasSelectedPreviously;
        if (address && zipCode) {
            checkAncillaryPriceByZip(option, showAdvisorScreen)
        } else {
            if (shouldRedirectToLocation) {
                redirectToLocation();
            } else {
                handleAdvisorSelection(showAdvisorScreen)
            }
        }
    }

    const clearAppointmentSlot = (newOption: IFirstScreenOption) => {
        if (newOption?.type === EServiceType.PickUpDropOff) {
            dispatch(selectAppointment(null));
        } else {
            dispatch(selectServiceValetAppointment(null));
        }
    }

    const redirectToNextScreen = (option: IFirstScreenOption, showAdvisorScreen: boolean) => {
        if (option?.type === EServiceType.PickUpDropOff) {
            onRedirectToLocation(option, showAdvisorScreen);
        } else {
            handleAdvisorSelection(showAdvisorScreen)
        }
    }

    const clearAdvisor = () => dispatch(setAdvisor(null));

    const onEmptyList = (option: IFirstScreenOption, showAdvisorScreen: boolean) => {
        dispatch(setAdvisorAvailable(false))
        if (option?.type === EServiceType.PickUpDropOff) {
            onRedirectToLocation(option, showAdvisorScreen);
        }
    }

    const onFullList = (data: IServiceConsultant[], option: IFirstScreenOption, showAdvisorScreen: boolean) => {
        const prevAdvisor = advisor && data.map(el => el.id).includes(advisor?.id);
        if (prevAdvisor) {
            redirectToNextScreen(option, false)
        } else {
            clearAdvisor();
            redirectToNextScreen(option, showAdvisorScreen)
        }
    }

    const onCarIsValid = (option: IFirstScreenOption, shouldLoadAdvisors: boolean, showAdvisorScreen: boolean) => {
        const requestDataIsValid = option?.type === EServiceType.VisitCenter || Boolean(address && zipCode)
        if (shouldLoadAdvisors && requestDataIsValid) {
            dispatch(loadConsultants(
                id,
                option.id,
                () => onEmptyList(option, showAdvisorScreen),
                (data) => onFullList(data, option, showAdvisorScreen)
            ));
        } else {
            if (!showAdvisorScreen) dispatch(setAdvisor(null));
            redirectToNextScreen(option, showAdvisorScreen)
        }
    }

    const handleTransportation = (newOption: IFirstScreenOption)=> {
        const newConfig = config.find(item => item.serviceType === newOption.type);
        const isTransportationAvailable = Boolean(newConfig?.transportationNeeds) && !newOption?.transportationOption;
        if (isTransportationAvailable) {
            handleSetScreen("transportationNeeds")
        } else if (transportation) {
            dispatch(setTransportation(null));
        }
    }

    const handleAdvisors = (newOption: IFirstScreenOption) => {
        const shouldLoadAdvisors = newOption?.type === EServiceType.VisitCenter
            || Boolean(newOption?.type === EServiceType.PickUpDropOff && address && zipCode);
        let isAdvisorSelectionOn = Boolean(config.find(item => item.serviceType === newOption.type)?.advisorSelection);
        dispatch(checkCarIsValid(
            () => onCarIsValid(newOption, shouldLoadAdvisors, isAdvisorSelectionOn),
            undefined,
            true))
    }

    const handleServiceOptionChange = (e: SelectChangeEvent<unknown>) => {
        const newOption = firstScreenOptions.find(item => item.id === e.target.value);
        if (newOption) {
            handleTransportation(newOption)
            dispatch(setServiceTypeOption(newOption));
            handleAdvisors(newOption);
            clearAppointmentSlot(newOption);
            dispatch(setServiceOptionChanged(true))
        }
    }

    return serviceValetIsPossibleToUse
        ? <div
            className={classes.selectWrapper}
            style={isMobile ? appointment || serviceValetAppointment ? {marginBottom: 8} : {} : {marginTop: 10}}>
            <div className={classes.selectWrapper}>
                <span style={{whiteSpace: 'nowrap'}}>{t("Service Option")}: {isSm ? <br/> : null}</span>
                <Select
                    value={serviceTypeOption?.id}
                    className={classes.select}
                    variant="standard"
                    disableUnderline
                    fullWidth={isMobile}
                    onChange={handleServiceOptionChange}>
                    {firstScreenOptions
                        .filter(option => option.type === EServiceType.PickUpDropOff || option.type === EServiceType.VisitCenter)
                        .map(option => <MenuItem value={option.id} key={option.name}>{option.name}</MenuItem>)}
                </Select>
            </div>
        </div>
        : <div className="service-list" style={{marginBottom: 10, marginTop: 20}}>
            <div>{t("Service Option")}: {getServiceName()}</div>
        </div>
};

export default ServiceOption;