import React, {useMemo} from 'react';
import {MenuItem, Select, SelectChangeEvent, useMediaQuery, useTheme} from "@mui/material";
import {useTranslation} from "react-i18next";
import {setTransportation} from "../../../../../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../../../store/rootReducer";
import clsx from "clsx";
import {useStyles} from "../ServiceOption/styles";
import {EServiceType} from "../../../../../../../store/reducers/appointmentFrameReducer/types";

const SelectedTransportation = () => {
    const { transportation, transportations, isTransportationsLoading, serviceTypeOption } = useSelector((state: RootState) => state.appointmentFrame);
   const { isTransportationAvailable } = useSelector((state: RootState) => state.bookingFlowConfig);
    const { firstScreenOptions } = useSelector((state: RootState) => state.serviceTypes);
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const { classes  } = useStyles();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('mdl'));
    const value = transportation
        ? transportation.id
        : serviceTypeOption?.transportationOption
            ? serviceTypeOption.transportationOption.id
            : ""

    const someServicesHaveDefaultTransportation = useMemo(() => {
        const someOptionHasDefaultTransportation = firstScreenOptions.some(el => el.transportationOption)
        const someOptionHasNotDefaultTransportation = firstScreenOptions.some(el => !el.transportationOption)
        return someOptionHasDefaultTransportation && someOptionHasNotDefaultTransportation
    }, [firstScreenOptions])

    const noOneServiceHasTransportation = firstScreenOptions
        .filter(el => !el.transportationOption).length === firstScreenOptions.length

    const handleChange = (e: SelectChangeEvent<unknown>) => {
        const selected = transportations.find(item => item.id === e.target.value);
        dispatch(setTransportation(selected ?? null))
    }

    return ((someServicesHaveDefaultTransportation && (serviceTypeOption?.transportationOption || isTransportationAvailable))
        || (noOneServiceHasTransportation && isTransportationAvailable))
    && serviceTypeOption?.type !== EServiceType.MobileService
    && transportations.length
            ? <div style={isSm ? {marginBottom: 4} : {}}>
                <div>
                    <div className={clsx("uppercase", classes.label)}>{t("Transportation")}</div>
                    <Select
                        value={value}
                        className={classes.select}
                        variant="standard"
                        disableUnderline
                        fullWidth={isSm}
                        disabled={!isTransportationAvailable || isTransportationsLoading}
                        onChange={handleChange}>`
                        {transportations.map(item => <MenuItem value={item.id} key={item.name}>{item.name}</MenuItem>)}
                    </Select>
                </div>
            </div>
            : null
};

export default SelectedTransportation;