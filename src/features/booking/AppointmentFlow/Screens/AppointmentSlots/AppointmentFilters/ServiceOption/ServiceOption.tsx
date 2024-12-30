import React, {useState} from 'react';
import {Select, SelectChangeEvent} from "@mui/material";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../../../store/rootReducer";
import {useTranslation} from "react-i18next";
import {IFirstScreenOption} from "../../../../../../../store/reducers/serviceTypes/types";
import {TCallback} from "../../../../../../../types/types";
import {useStyles} from "./styles";
import clsx from "clsx";
import SwitchFlowModal from "../../../../../SwitchFlowModal/SwitchFlowModal";
import {useModal} from "../../../../../../../hooks/useModal/useModal";

type TProps = {
    onChangeServiceOption: TCallback;
    hideLabel?: boolean;
    isVisible: boolean;
    options: React.JSX.Element[];
}

const ServiceOption: React.FC<TProps> = ({onChangeServiceOption, isVisible, options, hideLabel}) => {
    const {serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame);
    const { firstScreenOptions } = useSelector((state: RootState) => state.serviceTypes);
    const [selectedOption, setSelectedOption] = useState<IFirstScreenOption|null>(null);

    const {t} = useTranslation();
    const { classes  } = useStyles();
    const {isOpen: isSwitchFlowOpen, onClose: onSwitchFlowClose, onOpen: onSwitchFlowOpen} = useModal();

    const onServiceOptionChange = (e: SelectChangeEvent<unknown>) => {
        const newOption = firstScreenOptions.find(item => item.id === e.target.value);
        if (newOption) {
            onChangeServiceOption()
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
                    disabled={options.length === 1}
                    onChange={onServiceOptionChange}>
                    {options}
                </Select>
            </div>
            <SwitchFlowModal open={isSwitchFlowOpen} onClose={onSwitchFlowClose} selectedOption={selectedOption}/>
        </div>
    ) : null
};

export default ServiceOption;