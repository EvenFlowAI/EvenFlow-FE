import React, {Dispatch, SetStateAction, useEffect} from 'react';
import {MenuItem, Select, SelectChangeEvent, useMediaQuery, useTheme} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {useStyles} from "../styles";
import {ITransportation} from "../../../../api/types";
import {ETransportationType} from "../../../../store/reducers/transportationNeeds/types";

type TProps = {
    isVisible: boolean;
    selectedTransportation: ITransportation|null;
    setSelectedTransportation: Dispatch<SetStateAction<ITransportation|null>>;
}

const Transportation: React.FC<TProps> = ({isVisible, selectedTransportation, setSelectedTransportation}) => {
    const { transportation, transportations, isTransportationsLoading, serviceTypeOption } = useSelector((state: RootState) => state.appointmentFrame);
    const { isTransportationAvailable } = useSelector((state: RootState) => state.bookingFlowConfig);
    const {t} = useTranslation();
    const { classes  } = useStyles();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('mdl'));

    useEffect(() => {
        setSelectedTransportation(transportation ?? serviceTypeOption?.transportationOption ?? null)
    }, [transportation, serviceTypeOption])

    const handleChange = (e: SelectChangeEvent<unknown>) => {
        const selected = transportations.find(item => item.id === e.target.value);
        setSelectedTransportation(selected ?? null)
    }

    return isVisible
        ? <div style={isSm ? {marginBottom: 4} : {}}>
                <div className={classes.label}>{t("Transportation")}</div>
            <Select
                value={selectedTransportation?.id ?? ""}
                className={classes.select}
                variant="standard"
                disableUnderline
                fullWidth={isSm}
                disabled={!isTransportationAvailable || isTransportationsLoading}
                onChange={handleChange}>
                {transportations
                    .filter(el => el.type !== ETransportationType.PickUpDelivery)
                    .map(item => <MenuItem value={item.id} key={item.name}>{item.description}</MenuItem>)}
            </Select>
        </div>
        : null
};

export default Transportation;