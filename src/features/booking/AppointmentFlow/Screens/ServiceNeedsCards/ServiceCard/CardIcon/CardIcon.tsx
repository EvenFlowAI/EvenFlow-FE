import React from 'react';
import {ReactComponent as Icon} from "../../../../../../../assets/img/oil-icon.svg";
import DefaultIcon from "../../../../../../../assets/img/oil-icon.svg";

type TProps = {
    iconPath?: string;
    isSM?: boolean;
    active?: boolean;
}

const CardIcon: React.FC<TProps> = ({iconPath, isSM, active}) => {
    return iconPath
        ? <span
            className="cardIcon"
            style={{ filter: active ? "invert(100%)" : "unset"}}>
                    <img
                        src={iconPath}
                        style={{width: isSM ? 78 : 110, height: isSM ? 78 : 110}}
                        alt={"service_category_logo"}/>
                 </span>
        : <span
            className="cardIcon"
            style={{ filter: active ? "invert(100%)" : "unset"}}>
                    { isSM
                        ? <img
                            src={DefaultIcon}
                            style={{width: 65, height: 65}}
                            alt={"service_category_logo"}/>
                        : <Icon />}
        </span>
};

export default CardIcon;