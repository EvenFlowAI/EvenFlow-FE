import React, {useEffect, useState} from 'react';
import {TCallback} from "../../../types/types";
import {CardWrapper} from "./styled";
import {IServiceCategory} from "../../../api/types";
import {ReactComponent as Icon} from "../../../assets/img/oil-icon.svg";
import {styled} from "@material-ui/core";
import axios from "axios";
import {Loading} from "../../UI/Loading";

// const IconWrapper = styled('span')(({theme}) => ({
//     [theme.breakpoints.down("sm")]: {
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//     }
// }))

type TSCProps = {
    card: IServiceCategory;
    onSelect: TCallback;
    active: boolean;
}
export const ServiceCard: React.FC<TSCProps> = ({card, onSelect, active}) => {
    const [icon, setIcon] = useState<string>('');
    const [isLoading, setLoading] = useState<boolean>(false)
    useEffect(() => {
        if (card.iconPath) {
            setLoading(true);
            axios.get(card.iconPath, {withCredentials: false})
                .then(({ data }) => {
                    setIcon(data)
                })
                .finally(() => setLoading(false))
        }
    }, [card])
    return <CardWrapper onClick={onSelect} active={active}>
        {isLoading
            ? <Loading/>
            : card.iconPath && icon
                ? <span  dangerouslySetInnerHTML={{__html: icon}} />
                 : <span><Icon /></span>
        }
        <span>{card.name}</span>
    </CardWrapper>
}