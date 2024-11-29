import React, {useMemo} from 'react';
import {EServiceType} from "../../../../../../../store/reducers/appointmentFrameReducer/types";
import {MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../../../store/rootReducer";
import {useTranslation} from "react-i18next";
import {
    selectAppointment,
    selectServiceValetAppointment,
} from "../../../../../../../store/reducers/appointment/actions";
import {IFirstScreenOption} from "../../../../../../../store/reducers/serviceTypes/types";
import {TArgCallback} from "../../../../../../../types/types";
import {useStyles} from "./styles";
import clsx from "clsx";
import {useChangeServiceOption} from "../../../../../../../hooks/useChangeServiceOption/useChangeServiceOption";

type TProps = {
    onChangeServiceOption: TArgCallback<IFirstScreenOption>;
}

const ServiceOption: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({onChangeServiceOption}) => {
    const {serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame);
    const { firstScreenOptions } = useSelector((state: RootState) => state.serviceTypes);
    const { config } = useSelector((state: RootState) => state.bookingFlowConfig);
    const options = useMemo(() => {
        return serviceTypeOption?.type !== EServiceType.MobileService
            ? firstScreenOptions
                .filter(option => option.type === EServiceType.PickUpDropOff || option.type === EServiceType.VisitCenter)
                .map(option => <MenuItem value={option.id} key={option.name}>{option.name}</MenuItem>)
            : firstScreenOptions.map(option => <MenuItem value={option.id} key={option.name}>{option.name}</MenuItem>)
    }, [firstScreenOptions, serviceTypeOption])

    const {t} = useTranslation();
    const { classes  } = useStyles();
    const dispatch = useDispatch();

    const handleServiceOptionChange = useChangeServiceOption("serviceType")

    const serviceValetIsPossibleToUse = useMemo(() => {
        return serviceTypeOption?.type !== EServiceType.MobileService
            && firstScreenOptions.find(op => op.type === EServiceType.PickUpDropOff)
            && config.find(item => item.serviceType === EServiceType.PickUpDropOff && item.available)
    }, [serviceTypeOption, firstScreenOptions, config]);

    const clearAppointmentSlot = (newOption: IFirstScreenOption) => {
        onChangeServiceOption(newOption)
        if (newOption?.type === EServiceType.PickUpDropOff) {
            dispatch(selectAppointment(null));
        } else {
            dispatch(selectServiceValetAppointment(null));
        }
    }

    const onServiceOptionChange = (e: SelectChangeEvent<unknown>) => {
        const newOption = firstScreenOptions.find(item => item.id === e.target.value);
        if (newOption) {
            handleServiceOptionChange(newOption)
            clearAppointmentSlot(newOption);
        }
    }

    return options.length > 1 ? (
        <div
            className={classes.selectWrapper}>
            <div className={classes.selectWrapper} style={{display: 'block'}}>
                <div className={clsx("uppercase", classes.label)}>{t("Service Option")}</div>
                <Select
                    value={serviceTypeOption?.id ?? undefined}
                    className={classes.select}
                    disabled={!serviceValetIsPossibleToUse}
                    variant="standard"
                    disableUnderline
                    fullWidth
                    onChange={onServiceOptionChange}>
                    {options}
                </Select>
            </div>
        </div>
    ) : null
};

export default ServiceOption;