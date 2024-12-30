import React, {Dispatch, SetStateAction} from 'react';
import {Select, SelectChangeEvent} from "@mui/material";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../../../store/rootReducer";
import {useTranslation} from "react-i18next";
import {IFirstScreenOption} from "../../../../../../../store/reducers/serviceTypes/types";
import {TCallback} from "../../../../../../../types/types";
import {useStyles} from "./styles";
import clsx from "clsx";

type TProps = {
    hideLabel?: boolean;
    isVisible: boolean;
    options: React.JSX.Element[];
    setSelectedOption: Dispatch<SetStateAction<IFirstScreenOption|null>>;
    onChangeServiceOption: TCallback;
    onSwitchFlowOpen: TCallback;
}

const ServiceOption: React.FC<TProps> = ({
                                             onChangeServiceOption,
                                             isVisible,
                                             options,
                                             hideLabel,
                                             setSelectedOption,
                                             onSwitchFlowOpen
                                         }) => {
    const {serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame);
    const {isAppointmentSlotsLoading} = useSelector((state: RootState) => state.appointment);
    const { firstScreenOptions } = useSelector((state: RootState) => state.serviceTypes);

    const {t} = useTranslation();
    const { classes  } = useStyles();

    const onServiceOptionChange = (e: SelectChangeEvent<unknown>) => {
        const newOption = firstScreenOptions.find(item => item.id === e.target.value);
        if (newOption) {
            setSelectedOption(newOption)
            onSwitchFlowOpen()
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
                    disabled={options.length === 1 || isAppointmentSlotsLoading}
                    onChange={onServiceOptionChange}>
                    {options}
                </Select>
            </div>
        </div>
    ) : null
};

export default ServiceOption;