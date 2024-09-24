import React from 'react';
import {NoIcon} from "../styles";
import {useTranslation} from "react-i18next";
import {ReactComponent as NoIconMobile} from '../../../../../../../assets/img/noIcon.svg'

type TProps = {
    iconPath?: string;
    isSM?: boolean;
    active?: boolean;
}

const CardIcon: React.FC<TProps> = ({iconPath, isSM, active}) => {
    const {t} = useTranslation();
    return iconPath
        ? <span
            className="cardIcon"
            style={{ filter: active ? "invert(100%)" : "unset"}}>
                    <img
                        src={iconPath}
                        style={{width: isSM ? 78 : 110, height: isSM ? 78 : 110}}
                        alt={"service_category_logo"}/>
                 </span>
        : isSM ? <NoIconMobile/> : <NoIcon>{t("No Icon")}</NoIcon>
};

export default CardIcon;