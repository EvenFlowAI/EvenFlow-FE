import React from 'react';
import {TCallback} from "../../../../../../types/types";
import {ITransportation} from "../../../../../../api/types";
import {useMediaQuery, useTheme} from "@mui/material";
import {CardWrapper} from "./styles";
import CardIcon from "./CardIcon/CardIcon";

type TSCProps = {
    card: ITransportation;
    onSelect: TCallback;
    active: boolean;
}

export const TransportationOptionCard: React.FC<React.PropsWithChildren<React.PropsWithChildren<TSCProps>>> = ({card, onSelect, active}) => {
    const theme = useTheme();
    const isSM = useMediaQuery(theme.breakpoints.down('mdl'));

    return <CardWrapper
        onClick={onSelect}
        selected={false}
        key={card.id}
        active={active}>
        <CardIcon iconPath={card.iconPath} isSM={isSM} active={active}/>
        <span style={{color: active ? "#FFFFFF" : "#252733"}}>{card.description}</span>
    </CardWrapper>
}