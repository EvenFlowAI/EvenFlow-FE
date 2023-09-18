import React, {useMemo} from 'react';
import {EServiceType} from "../../../../store/reducers/appointmentFrameReducer/types";
import {MenuItem, Select} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {useTranslation} from "react-i18next";
import {useSelectedAppointmentStyles} from "../SelectedAppointment";
import {selectAppointment, selectServiceValetAppointment} from "../../../../store/reducers/appointment/actions";
import {
    loadConsultants,
    setAdvisor,
    setCurrentFrameScreen,
    setServiceOptionChanged,
    setServiceTypeOption,
    setSideBarSteps,
    setTransportation
} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {useParams} from "react-router-dom";
import {IFirstScreenOption} from "../../../../store/reducers/serviceTypes/types";
import {setAdvisorAvailable} from "../../../../store/reducers/bookingFlowConfig/actions";

const ServiceOption: React.FC<{isSm: boolean}> = ({isSm}) => {
    const {
        serviceTypeOption,
        sideBarSteps,
        serviceOptionChangedFromSlotPage,
        address,
        zipCode,
        selectedServiceOptions,
    } = useSelector((state: RootState) => state.appointmentFrame);
    const { firstScreenOptions } = useSelector((state: RootState) => state.serviceTypes);
    const { config, isAdvisorAvailable } = useSelector((state: RootState) => state.bookingFlowConfig);

    const {t} = useTranslation();
    const classes = useSelectedAppointmentStyles();
    const dispatch = useDispatch();
    const {id} = useParams();

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
                // todo find out why step "Service Needs" is missing
                const index = sideBarSteps.indexOf("appointmentSelection")
                sliceSteps(index)
            }
        }
    }

    const handleAdvisorSelection = (showAdvisorScreen: boolean) => {
        handleSideBar(showAdvisorScreen);
        if (showAdvisorScreen) dispatch(setCurrentFrameScreen('consultantSelection'))
    }

    const redirectToLocation = (option: IFirstScreenOption, showAdvisorScreen: boolean) => {
        const optionWasSelectedPreviously = selectedServiceOptions.find(el => el.id === option.id);
        const shouldRedirectToLocation = !address || !zipCode || !serviceOptionChangedFromSlotPage || !optionWasSelectedPreviously;
        if (shouldRedirectToLocation) {
            dispatch(setCurrentFrameScreen("location"))
            dispatch(setSideBarSteps([]))
        } else {
            handleAdvisorSelection(showAdvisorScreen)
        }
    }

    const clearAppointment = (option: IFirstScreenOption) => {
        if (option?.type === EServiceType.PickUpDropOff) {
            dispatch(selectAppointment(null));
        } else {
            dispatch(selectServiceValetAppointment(null));
        }
    }

    const handleServiceOptionChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        dispatch(setTransportation(null));
        const option = firstScreenOptions.find(item => item.id === e.target.value);
        if (option) {
            let showAdvisorScreen = Boolean(config.find(item => item.serviceType === option.type)?.advisorSelection);
            const shouldLoadAdvisors = option?.type === EServiceType.VisitCenter
                || (option?.type === EServiceType.PickUpDropOff && address && zipCode)

            dispatch(setServiceTypeOption(option));
            dispatch(setAdvisor(null));

            if (shouldLoadAdvisors) {
                dispatch(loadConsultants(id, option.id, () => {
                    showAdvisorScreen = false;
                    dispatch(setAdvisorAvailable(false))
                }));
            }
            clearAppointment(option);
            if (option?.type === EServiceType.PickUpDropOff) {
                redirectToLocation(option, showAdvisorScreen);
            } else {
                handleAdvisorSelection(showAdvisorScreen)
            }
        }
        dispatch(setServiceOptionChanged(true))
    }

    return serviceValetIsPossibleToUse
            ? <div className={classes.selectWrapper} style={{marginTop: 10}}>
                <div className={classes.selectWrapper}>
                    <span style={{whiteSpace: 'nowrap'}}>{t("SERVICE OPTION")}: {isSm ? <br/> : null}</span>
                    <Select
                        value={serviceTypeOption?.id}
                        className={classes.select}
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