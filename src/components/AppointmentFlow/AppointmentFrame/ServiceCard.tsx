import React, {useEffect, useState} from 'react';
import {TCallback} from "../../../types/types";
import {CardWrapper} from "./styled";
import {IServiceCategory} from "../../../api/types";
import {ReactComponent as Icon} from "../../../assets/img/oil-icon.svg";
import axios from "axios";
import {Loading} from "../../UI/Loading";

type TSCProps = {
    card: IServiceCategory;
    onSelect: TCallback;
    active: boolean;
    selected: boolean;
}
export const ServiceCard: React.FC<TSCProps> = ({card, onSelect, active, selected}) => {
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
    return <CardWrapper onClick={onSelect} active={active} selected={selected}>
        {isLoading
            ? <Loading/>
            : card.iconPath && icon
                ? <span  dangerouslySetInnerHTML={{__html: icon}} />
                 : <span><Icon /></span>
        }
        <span>{card.name}</span>
    </CardWrapper>
}