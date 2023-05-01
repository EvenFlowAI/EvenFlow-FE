import React from 'react';
import {EServiceType} from "../../../../store/reducers/appointmentFrameReducer/types";
import {MenuItem, Select} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {useTranslation} from "react-i18next";
import {useSelectedAppointmentStyles} from "../SelectedAppointment";
import {selectAppointment, selectServiceValetAppointment} from "../../../../store/reducers/appointment/actions";
import {setServiceType, setServiceTypeOption} from "../../../../store/reducers/appointmentFrameReducer/actions";

const ServiceOption: React.FC<{isSm: boolean}> = ({isSm}) => {
    const {serviceTypeOption, serviceType, primarySelectedServiceTypeOption, address, zipCode} = useSelector((state: RootState) => state.appointmentFrame);
    const { firstScreenOptions } = useSelector((state: RootState) => state.serviceTypes);
    const {t} = useTranslation();
    const classes = useSelectedAppointmentStyles();
    const dispatch = useDispatch();

    const getServiceName = () => {
        if (serviceTypeOption?.name) return serviceTypeOption.name
        switch (serviceType) {
            case EServiceType.MobileService:
                return t("Mobile Service");
            case EServiceType.PikUpDropOff:
                return t("Pick Up / Drop Off Service");
            default:
                return t("Visit Center");
        }
    }

    const handleServiceOptionChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        if (e.target.value === EServiceType.PikUpDropOff) {
            dispatch(selectAppointment(null))
        } else {
            dispatch(selectServiceValetAppointment(null));
        }
        const option = firstScreenOptions.find(item => item.id === e.target.value);
        if (option) {
            dispatch(setServiceTypeOption(option));
            dispatch(setServiceType(option.type))
        }
    }

    return primarySelectedServiceTypeOption?.type !== EServiceType.VisitCenter
        ? serviceTypeOption?.type !== EServiceType.MobileService && address && zipCode
            ? <div className={classes.selectWrapper}>
                <div className={classes.selectWrapper}>
                    {t("PROVIDED BY OUR")}: {isSm ? <br/> : null}
                    <Select
                        value={serviceTypeOption?.id}
                        className={classes.select}
                        onChange={handleServiceOptionChange}>
                        {firstScreenOptions
                            .filter(option => option.type === EServiceType.PikUpDropOff || option.type === EServiceType.VisitCenter)
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