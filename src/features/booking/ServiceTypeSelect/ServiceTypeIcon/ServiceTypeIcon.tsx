import React, {useEffect, useMemo, useState} from 'react';
import axios from "axios";
import {IFirstScreenOption} from "../../../../store/reducers/serviceTypes/types";
import {Loading} from "../../../../components/Loading/Loading";
import {useTranslation} from "react-i18next";
import {useStyles} from "./styles";

type TServiceTypeIconProps = {card: IFirstScreenOption}

const ServiceTypeIcon: React.FC<TServiceTypeIconProps> = ({card}) => {
    const [isIconLoading, setIsIconLoading] = useState<boolean>(false);
    const [icon, setIcon] = useState<string>('');
    const classes = useStyles();
    const {t} = useTranslation();

    const iconType = useMemo((): string => {
        if (card.iconPath?.length) {
            const index = card.iconPath.lastIndexOf('.');
            return index > 0 ? card.iconPath.slice(index, card.iconPath.length - 1) : '';
        }
        return '';
    }, [card.iconPath])

    useEffect(() => {
        if (card.iconPath && iconType.length && iconType.toLowerCase() === 'svg') {
            setIsIconLoading(true);
            axios.get(card.iconPath, {withCredentials: false})
                .then(({ data }) => {
                    setIcon(data)
                })
                .finally(() => setIsIconLoading(false))
        }
    }, [iconType, card])

    return isIconLoading
        ? <Loading/>
        : card.iconPath
            ? iconType.toLowerCase() === 'svg'
                ? <div className={classes.icon} dangerouslySetInnerHTML={{__html: icon}} />
                : <div className={classes.icon}
                    //style={{backgroundImage: `url(${card.iconPath})`}}
                >
                    <img className={classes.image} src={card.iconPath} alt="logo"/>
                </div>
            : <div className={classes.noLogo}>{t("No logo")}</div>
};

export default ServiceTypeIcon;