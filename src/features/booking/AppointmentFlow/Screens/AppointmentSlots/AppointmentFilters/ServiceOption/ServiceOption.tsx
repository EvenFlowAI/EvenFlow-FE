import React from 'react';
import {EServiceType} from "../../../../../../../store/reducers/appointmentFrameReducer/types";
import {Select, SelectChangeEvent} from "@mui/material";
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
import {useServiceOption} from "../../../../../../../hooks/useServiceOption/useServiceOption";

type TProps = {
    onChangeServiceOption: TArgCallback<IFirstScreenOption>;
    hideLabel?: boolean;
    isVisible: boolean;
    options: React.JSX.Element[];
}

const ServiceOption: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({onChangeServiceOption, isVisible, options, hideLabel}) => {
    const {serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame);
    const { firstScreenOptions } = useSelector((state: RootState) => state.serviceTypes);

    const {t} = useTranslation();
    const { classes  } = useStyles();
    const dispatch = useDispatch();

    const handleServiceOptionChange = useServiceOption("serviceType")

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

    return isVisible ? (
        <div
            className={classes.selectWrapper}>
            <div className={classes.selectWrapper} style={{display: 'block'}}>
                {!hideLabel ? <div className={clsx("uppercase", classes.label)}>{t("Service Option")}</div> : null}
                <Select
                    value={serviceTypeOption?.id ?? undefined}
                    className={classes.select}
                    variant="standard"
                    disableUnderline
                    fullWidth
                    disabled={options.length === 1}
                    onChange={onServiceOptionChange}>
                    {options}
                </Select>
            </div>
        </div>
    ) : null
};

export default ServiceOption;