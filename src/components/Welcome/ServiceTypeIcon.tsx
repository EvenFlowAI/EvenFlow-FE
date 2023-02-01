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
            //axios.get(card.iconPath, {withCredentials: false})
            axios.get('https://evenflowai-develop-service-category-icons.s3.eu-central-1.amazonaws.com/c0f70222-eed4-45dc-9578-480641cef3c8.svg?X-Amz-Expires=21600&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIARZLEY6T3C6IM574P/20230130/eu-central-1/s3/aws4_request&X-Amz-Date=20230130T112459Z&X-Amz-SignedHeaders=host&X-Amz-Signature=93b069303d94b0457eb46e50faa5534a7d8406a417135f8ac9503b75c38d3757', {withCredentials: false})
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