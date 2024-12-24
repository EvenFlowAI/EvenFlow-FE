import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {MenuItem, Select, SelectChangeEvent, useMediaQuery, useTheme} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {useStyles} from "../styles";
import {ITransportation} from "../../../../api/types";
import {ETransportationType} from "../../../../store/reducers/transportationNeeds/types";
import useGetTransportationsData from "../../../../hooks/useGetTransportationsData/useGetTransportationsData";
import {Api} from "../../../../api/ApiEndpoints/ApiEndpoints";
import {Loading} from "../../../../components/wrappers/Loading/Loading";

type TProps = {
    isVisible: boolean;
    selectedTransportation: ITransportation|null;
    setSelectedTransportation: Dispatch<SetStateAction<ITransportation|null>>;
}

const Transportation: React.FC<TProps> = ({isVisible, selectedTransportation, setSelectedTransportation}) => {
    const { transportation, transportations, isTransportationsLoading } = useSelector((state: RootState) => state.appointmentFrame);
    const { isTransportationAvailable } = useSelector((state: RootState) => state.bookingFlowConfig);
    const [transportationsList, setTransportationsList] = useState<ITransportation[]>([])
    const [isLoading, setLoading] = useState<boolean>(false);
    const {t} = useTranslation();
    const { classes  } = useStyles();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('mdl'));
    const requestData = useGetTransportationsData();

    useEffect(() => {
        if (requestData) {
            setLoading(true)
            Api.call<ITransportation[]>(Api.endpoints.TransportationOptions.GetActive, {data: requestData})
                .then(({data}) => {
                    const list = data.filter(el => el.type !== ETransportationType.PickUpDelivery)
                    const currentTransportation = list.find(el => el.id === transportation?.id);
                    if (currentTransportation) setSelectedTransportation(currentTransportation)
                    setTransportationsList(list);
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }, [requestData, transportation])

    const handleChange = (e: SelectChangeEvent<unknown>) => {
        const selected = transportations.find(item => item.id === e.target.value);
        setSelectedTransportation(selected ?? null)
    }

    return isVisible
        ? isLoading
            ? <Loading/>
            : <div style={isSm ? {marginBottom: 4} : {}}>
                <div className={classes.label}>{t("Transportation")}</div>
            <Select
                value={selectedTransportation?.id ?? ""}
                className={classes.select}
                variant="standard"
                disableUnderline
                fullWidth={isSm}
                disabled={!isTransportationAvailable || isTransportationsLoading}
                onChange={handleChange}>
                {transportationsList.map(item => <MenuItem value={item.id} key={item.name}>{item.description}</MenuItem>)}
            </Select>
        </div>
        : null
};

export default Transportation;