import React from 'react';
import {TCallback} from "../../../types/types";
import {CardWrapper} from "./styled";
import {IServiceCategory} from "../../../api/types";
import {ReactComponent as Icon} from "../../../assets/img/oil-icon.svg";
import {styled} from "@material-ui/core";

const IconWrapper = styled('span')(({theme}) => ({
    [theme.breakpoints.down("sm")]: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }
}))

type TSCProps = {
    card: IServiceCategory;
    onSelect: TCallback;
    active: boolean;
}
export const ServiceCard: React.FC<TSCProps> = ({card, onSelect, active}) => {
    return <CardWrapper onClick={onSelect} active={active}>
        {card.loadedIcon
            ? typeof card.loadedIcon === 'string'
                ? <span  dangerouslySetInnerHTML={{__html: card.loadedIcon}} />
                : <IconWrapper>{card.loadedIcon}</IconWrapper>
            : <span><Icon /></span>
        }
        <span>{card.name}</span>
    </CardWrapper>
}