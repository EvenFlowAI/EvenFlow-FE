import React, {useEffect, useState} from 'react';
import axios from "axios";
import {IFirstScreenOption} from "../../store/reducers/serviceTypes/types";
import {Loading} from "../UI/Loading";

type TServiceTypeIconProps = {card: IFirstScreenOption, onClick: () => void, isSM: boolean}

const ServiceTypeIcon: React.FC<TServiceTypeIconProps> = ({card, onClick, isSM}) => {
    const [isIconLoading, setIsIconLoading] = useState<boolean>(false);
    const [icon, setIcon] = useState<string>('');

    useEffect(() => {
        if (card.iconPath) {
            setIsIconLoading(true);
            axios.get(card.iconPath, {withCredentials: false})
                .then(({ data }) => {
                    setIcon(data)
                })
                .finally(() => setIsIconLoading(false))
        }
    }, [card])
    return isIconLoading
        ? <Loading/>
        : card.iconPath && icon
            ? <div className="cardIcon" dangerouslySetInnerHTML={{__html: icon}} onClick={() => isSM && onClick()}/>
            : null
};

export default ServiceTypeIcon;