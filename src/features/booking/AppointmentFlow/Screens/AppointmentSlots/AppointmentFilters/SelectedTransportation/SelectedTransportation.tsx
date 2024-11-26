import React from 'react';
import {MenuItem, Select, SelectChangeEvent, useMediaQuery, useTheme} from "@mui/material";
import {useTranslation} from "react-i18next";
import {setTransportation} from "../../../../../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../../../store/rootReducer";
import clsx from "clsx";
import {useStyles} from "../ServiceOption/styles";
import {useChangeServiceOption} from "../../../../../../../hooks/useChangeServiceOption/useChangeServiceOption";
import {ETransportationType} from "../../../../../../../store/reducers/transportationNeeds/types";
import {EServiceType} from "../../../../../../../store/reducers/appointmentFrameReducer/types";
import {selectAppointment} from "../../../../../../../store/reducers/appointment/actions";

const SelectedTransportation: React.FC<{disabled?: boolean}> = ({disabled}) => {
    const { transportation, transportations, isTransportationsLoading } = useSelector((state: RootState) => state.appointmentFrame);
    const { currentConfig, isTransportationAvailable } = useSelector((state: RootState) => state.bookingFlowConfig);
    const {firstScreenOptions} = useSelector(({serviceTypes}: RootState) => serviceTypes)
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const { classes  } = useStyles();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('mdl'));

    const handleServiceOptionChange = useChangeServiceOption("transportation")

    const switchToServiceValet = () => {
        const serviceValetOption = firstScreenOptions.find(el => el.type === EServiceType.PickUpDropOff)
        if (serviceValetOption) {
            dispatch(selectAppointment(null));
            handleServiceOptionChange(serviceValetOption)
        }
    }

    const handleChange = (e: SelectChangeEvent<unknown>) => {
        const selected = transportations.find(item => item.id === e.target.value);
        if (selected?.type === ETransportationType.PickUpDelivery) {
            switchToServiceValet()
        }
        dispatch(setTransportation(selected ?? null))
    }

    return isTransportationAvailable && transportations?.length && transportation
        ? <div style={isSm ? {marginBottom: 4} : {}}>
            <div>
                <div className={clsx("uppercase", classes.label)}>{t("Transportation")}</div>
                <Select
                    value={transportation?.id ?? ''}
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