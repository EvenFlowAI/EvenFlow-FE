import React from 'react';
import {MenuItem, Select, SelectChangeEvent, useMediaQuery, useTheme} from "@mui/material";
import {useTranslation} from "react-i18next";
import {setTransportation} from "../../../../../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../../../store/rootReducer";
import clsx from "clsx";
import {useStyles} from "../ServiceOption/styles";

const SelectedTransportation: React.FC<{disabled?: boolean}> = ({disabled}) => {
    const { transportation, transportations, isTransportationsLoading } = useSelector((state: RootState) => state.appointmentFrame);
    const { currentConfig, isTransportationAvailable } = useSelector((state: RootState) => state.bookingFlowConfig);
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const { classes  } = useStyles();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('mdl'));

    const handleChange = (e: SelectChangeEvent<unknown>) => {
        const selected = transportations.find(item => item.id === e.target.value);
        dispatch(setTransportation(selected ?? null))
    }

    return isTransportationAvailable && transportations?.length
        ? <div style={isSm ? {marginBottom: 4} : {}}>
            <div>
                <div className={clsx("uppercase", classes.label)}>{t("Transportation")}</div>
                <Select
                    value={transportation?.id ?? ""}
                    className={classes.select}
                    variant="standard"
                    disableUnderline
                    fullWidth={isSm}
                    disabled={disabled || (!!currentConfig && !transportations.length) || isTransportationsLoading}
                    onChange={handleChange}>`
                    {transportations.map(item => <MenuItem value={item.id} key={item.name}>{item.name}</MenuItem>)}
                </Select>
            </div>
        </div>
        : null
};

export default SelectedTransportation;