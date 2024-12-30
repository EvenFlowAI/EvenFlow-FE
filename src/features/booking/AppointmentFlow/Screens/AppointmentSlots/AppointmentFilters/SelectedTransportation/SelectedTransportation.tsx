import React, {useMemo} from 'react';
import {MenuItem, Select, SelectChangeEvent, useMediaQuery, useTheme} from "@mui/material";
import {useTranslation} from "react-i18next";
import {
    setTransportation
} from "../../../../../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../../../store/rootReducer";
import clsx from "clsx";
import {useStyles} from "../ServiceOption/styles";
import {useServiceOption} from "../../../../../../../hooks/useServiceOption/useServiceOption";
import {ETransportationType} from "../../../../../../../store/reducers/transportationNeeds/types";
import {EServiceType} from "../../../../../../../store/reducers/appointmentFrameReducer/types";
import {selectAppointment} from "../../../../../../../store/reducers/appointment/actions";

const SelectedTransportation: React.FC<{isVisible: boolean}> = ({isVisible}) => {
    const { transportation, transportations, isTransportationsLoading, serviceTypeOption } = useSelector((state: RootState) => state.appointmentFrame);
   const { isTransportationAvailable } = useSelector((state: RootState) => state.bookingFlowConfig);
    const { firstScreenOptions } = useSelector((state: RootState) => state.serviceTypes);
    const {isAppointmentSlotsLoading} = useSelector((state: RootState) => state.appointment);
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const { classes  } = useStyles();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('mdl'));
    const value = useMemo(() => {
        return transportation && transportation.id
            ? transportation.id
            : serviceTypeOption && serviceTypeOption.transportationOption
                ? serviceTypeOption.transportationOption.id
                : ""
    }, [transportation, serviceTypeOption])

    const handleServiceOptionChange = useServiceOption("transportation")

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

    return isVisible
            ? <div style={isSm ? {marginBottom: 4} : {}}>
                <div>
                    <div className={clsx("uppercase", classes.label)}>{t("Transportation")}</div>
                    <Select
                        value={value}
                        className={classes.select}
                        variant="standard"
                        disableUnderline
                        fullWidth={isSm}
                        disabled={!isTransportationAvailable || isTransportationsLoading || isAppointmentSlotsLoading}
                        onChange={handleChange}>`
                        {transportations.map(item => <MenuItem value={item.id} key={item.name}>{item.description}</MenuItem>)}
                    </Select>
                </div>
            </div>
            : null
};

export default SelectedTransportation;