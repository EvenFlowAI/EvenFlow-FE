import React from 'react';
import {ReactComponent as NoIconDesktop} from '../../../../../../../assets/img/noIcon.svg'
import {ReactComponent as NoIconMobile} from '../../../../../../../assets/img/icon_Bus_80px_adaptive.svg'

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
        : isSM ? <NoIconMobile/> : <div className="cardIcon"><NoIconDesktop/></div>
};

export default CardIcon;