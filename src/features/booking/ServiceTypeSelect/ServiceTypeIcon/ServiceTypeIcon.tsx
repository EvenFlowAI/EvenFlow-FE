import React from 'react';
import {IFirstScreenOption} from "../../../../store/reducers/serviceTypes/types";
import {useTranslation} from "react-i18next";
import {useStyles} from "./styles";

type TServiceTypeIconProps = {card: IFirstScreenOption}

const ServiceTypeIcon: React.FC<React.PropsWithChildren<React.PropsWithChildren<TServiceTypeIconProps>>> = ({card}) => {
    const { classes  } = useStyles();
    const {t} = useTranslation();

    return card.iconPath
        ? <div className={classes.icon}>
            <img className={classes.image} src={card.iconPath} alt="logo"/>
        </div>
        : <div className={classes.noLogo}>{t("No logo")}</div>
};

export default ServiceTypeIcon;