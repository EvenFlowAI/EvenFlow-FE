import React, {useMemo} from 'react';
import {EServiceType} from "../../../../../../store/reducers/appointmentFrameReducer/types";
import {MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../../store/rootReducer";
import {useTranslation} from "react-i18next";
import {
    selectAppointment,
    selectServiceValetAppointment,
} from "../../../../../../store/reducers/appointment/actions";
import {
    checkCarIsValid,
    loadConsultants,
    setAdvisor,
    setCurrentFrameScreen,
    setServiceOptionChanged,
    setServiceTypeOption,
    setSideBarSteps,
    setTransportation
} from "../../../../../../store/reducers/appointmentFrameReducer/actions";
import {useParams} from "react-router-dom";
import {IFirstScreenOption} from "../../../../../../store/reducers/serviceTypes/types";
import {setAdvisorAvailable} from "../../../../../../store/reducers/bookingFlowConfig/actions";
import {IServiceConsultant} from "../../../../../../api/types";
import {useSelectedAppointmentStyles} from "../../../../../../hooks/styling/useSelectedAppointmentStyles";

const ServiceOption: React.FC<React.PropsWithChildren<React.PropsWithChildren<{isSm: boolean}>>> = ({isSm}) => {
    const {
        serviceTypeOption,
        sideBarSteps,
        serviceOptionChangedFromSlotPage,
        address,
        zipCode,
        selectedServiceOptions,
        advisor
    } = useSelector((state: RootState) => state.appointmentFrame);
    const { firstScreenOptions } = useSelector((state: RootState) => state.serviceTypes);
    const { config } = useSelector((state: RootState) => state.bookingFlowConfig);

    const {t} = useTranslation();
    const { classes  } = useSelectedAppointmentStyles();
    const dispatch = useDispatch();
    const {id} = useParams<{id: string}>();

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

    const onRedirectToLocation = (option: IFirstScreenOption, showAdvisorScreen: boolean) => {
        const optionWasSelectedPreviously = selectedServiceOptions.find(el => el.id === option.id);
        const shouldRedirectToLocation = !address || !zipCode || !serviceOptionChangedFromSlotPage || !optionWasSelectedPreviously;
        if (shouldRedirectToLocation) {
            dispatch(setCurrentFrameScreen("location"))
            dispatch(setSideBarSteps([]))
        } else {
            handleAdvisorSelection(showAdvisorScreen)
        }
    }

    const clearAppointmentSlot = (option: IFirstScreenOption) => {
        if (option?.type === EServiceType.PickUpDropOff) {
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

    const onEmptyList = () =>  dispatch(setAdvisorAvailable(false))

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
        if (shouldLoadAdvisors) {
            dispatch(loadConsultants(id, option.id, onEmptyList, (data) => onFullList(data, option, showAdvisorScreen)));
        } else {
            if (!showAdvisorScreen) dispatch(setAdvisor(null));
            redirectToNextScreen(option, showAdvisorScreen)
        }
    }

    const clearTransportation = ()=> {
        dispatch(setTransportation(null));
    }

    const handleAdvisors = (option: IFirstScreenOption) => {
        const shouldLoadAdvisors = option?.type === EServiceType.VisitCenter
            || Boolean(option?.type === EServiceType.PickUpDropOff && address && zipCode);
        let isAdvisorSelectionOn = Boolean(config.find(item => item.serviceType === option.type)?.advisorSelection);
        dispatch(checkCarIsValid(() => onCarIsValid(option, shouldLoadAdvisors, isAdvisorSelectionOn), undefined, true))
    }

    const handleServiceOptionChange = (e: SelectChangeEvent<unknown>) => {
        clearTransportation()
        const option = firstScreenOptions.find(item => item.id === e.target.value);
        if (option) {
            dispatch(setServiceTypeOption(option));
            handleAdvisors(option);
            clearAppointmentSlot(option);
            dispatch(setServiceOptionChanged(true))
        }
    }

    return serviceValetIsPossibleToUse
            ? <div className={classes.selectWrapper} style={{marginTop: 10}}>
                <div className={classes.selectWrapper}>
                    <span style={{whiteSpace: 'nowrap'}}>{t("SERVICE OPTION")}: {isSm ? <br/> : null}</span>
                    <Select
                        value={serviceTypeOption?.id}
                        className={classes.select}
                        variant="standard"
                        disableUnderline
                        onChange={handleServiceOptionChange}>
                        {firstScreenOptions
                            .filter(option => option.type === EServiceType.PickUpDropOff || option.type === EServiceType.VisitCenter)
                            .map(option => <MenuItem value={option.id} key={option.name}>{option.name}</MenuItem>)}
                    </Select>
                </div>
            </div>
            : <div className="service-list" style={{marginBottom: 10, marginTop: 20}}>
                <div>{t("SERVICE OPTION")}: {getServiceName()}</div>
            </div>
};

export default ServiceOption;