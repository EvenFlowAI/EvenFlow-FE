import React from 'react';
import {IFirstScreenOption} from "../../../../store/reducers/serviceTypes/types";
import {useStyles} from "./styles";
import {ReactComponent as NoLogo} from "../../../../assets/img/noLogo.svg"

type TServiceTypeIconProps = {card: IFirstScreenOption}

const ServiceTypeIcon: React.FC<React.PropsWithChildren<React.PropsWithChildren<TServiceTypeIconProps>>> = ({card}) => {
    const { classes  } = useStyles();

    return card.iconPath
        ? <div className={classes.icon}>
            <img className={classes.image} src={card.iconPath} alt="logo"/>
        </div>
        : <div className={classes.icon}><NoLogo/></div>
};

export default ServiceTypeIcon;