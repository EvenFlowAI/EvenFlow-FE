import React, {useMemo} from 'react';
import {EServiceType} from "../../../../store/reducers/appointmentFrameReducer/types";
import {MenuItem, Select} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {useTranslation} from "react-i18next";
import {useSelectedAppointmentStyles} from "../SelectedAppointment";
import {selectAppointment, selectServiceValetAppointment} from "../../../../store/reducers/appointment/actions";
import {
    loadConsultants, setAdvisor,
    setServiceTypeOption,
    setSideBarSteps, setTransportation
} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {useParams} from "react-router-dom";

const ServiceOption: React.FC<{isSm: boolean}> = ({isSm}) => {
    const {
        serviceTypeOption,
        selectedOptionTypes,
        address,
        zipCode,
        sideBarSteps
    } = useSelector((state: RootState) => state.appointmentFrame);
    const { firstScreenOptions } = useSelector((state: RootState) => state.serviceTypes);

    const {t} = useTranslation();
    const classes = useSelectedAppointmentStyles();
    const dispatch = useDispatch();
    const {id} = useParams();

    const serviceType = useMemo(() => serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter, [serviceTypeOption]);
    const wasSelectedSecondaryTypes = useMemo(() => {
        return  selectedOptionTypes.includes(EServiceType.MobileService)
        || selectedOptionTypes.includes(EServiceType.PickUpDropOff)
    }, [selectedOptionTypes]);
    const serviceValetIsPossibleToUse = useMemo(() => {
        return serviceTypeOption?.type !== EServiceType.MobileService && address && zipCode
    }, [serviceTypeOption, address, zipCode]);

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

    const handleSideBar = () => {
        const index = sideBarSteps.indexOf("appointmentSelection");
        if (index > -1) {
            const slicedSteps = sideBarSteps.slice(0, index + 1);
            dispatch(setSideBarSteps(slicedSteps))
        }
    }

    const handleServiceOptionChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        dispatch(setTransportation(null));
        const option = firstScreenOptions.find(item => item.id === e.target.value);
        if (option) {
            dispatch(setServiceTypeOption(option));
            dispatch(loadConsultants(id, option.id));
            dispatch(setAdvisor(null));
        }
        if (e.target.value === EServiceType.PickUpDropOff) {
            dispatch(selectAppointment(null));
        } else {
            dispatch(selectServiceValetAppointment(null));
        }
        handleSideBar();
    }

    return wasSelectedSecondaryTypes
        ? serviceValetIsPossibleToUse
            ? <div className={classes.selectWrapper}>
                <div className={classes.selectWrapper}>
                    {t("PROVIDED BY OUR")}: {isSm ? <br/> : null}
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
                <div>{t("PROVIDED BY OUR")}: {getServiceName()}</div>
            </div>
        : null
};

export default ServiceOption;