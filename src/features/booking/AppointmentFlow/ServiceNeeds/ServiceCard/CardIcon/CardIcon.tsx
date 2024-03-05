import React, {useEffect, useState} from 'react';
import {ReactComponent as Icon} from "../../../../../../assets/img/oil-icon.svg";
import DefaultIcon from "../../../../../../assets/img/oil-icon.svg";
import axios from "axios";
import {Loading} from "../../../../../../components/wrappers/Loading/Loading";

type TProps = {
    iconPath?: string;
    isSM?: boolean;
    active?: boolean;
}

const CardIcon: React.FC<TProps> = ({iconPath, isSM, active}) => {
    const [icon, setIcon] = useState<string>('');
    const [isLoading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (iconPath) {
            setLoading(true);
            axios.get(iconPath, {withCredentials: false})
                .then(({ data }) => {
                    setIcon(data)
                })
                .finally(() => setLoading(false))
        }
    }, [iconPath])

    return isLoading
        ? <Loading/>
        : iconPath && icon
            ? isSM
                ? <span
                    className="cardIcon"
                    style={{ filter: active ? "invert(100%)" : "unset"}}>
                    <img src={iconPath} style={{width: 78, height: 78}} alt={"service_category_logo"}/>
                 </span>
                : <span
                    className="cardIcon"
                    style={{ filter: active ? "invert(100%)" : "unset"}}
                    dangerouslySetInnerHTML={{__html: icon}}/>
            : isSM
                ? <span
                    className="cardIcon"
                    style={{ filter: active ? "invert(100%)" : "unset"}}>
                    <img src={DefaultIcon} style={{width: 65, height: 65}} alt={"service_category_logo"}/>
        </span>
                : <span
                    className="cardIcon"
                    style={{ filter: active ? "invert(100%)" : "unset"}}>
                <Icon />
            </span>
};

export default CardIcon;