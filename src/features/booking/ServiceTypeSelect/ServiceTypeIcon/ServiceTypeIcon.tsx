import React from 'react';
import {IFirstScreenOption} from "../../../../store/reducers/serviceTypes/types";
import {useStyles} from "./styles";
import {ReactComponent as NoLogo} from "../../../../assets/img/noLogo.svg"
import {ReactComponent as NoLogoBig} from "../../../../assets/img/noLogoBig.svg"
import {useMediaQuery, useTheme} from "@mui/material";

type TServiceTypeIconProps = {card: IFirstScreenOption}

const ServiceTypeIcon: React.FC<React.PropsWithChildren<React.PropsWithChildren<TServiceTypeIconProps>>> = ({card}) => {
    const { classes  } = useStyles();
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("mdl"))

    return card.iconPath
        ? <div className={classes.icon}>
            <img className={classes.image} src={card.iconPath} alt="logo"/>
        </div>
        : <div className={classes.icon}>{isMobile ? <NoLogo/> : <NoLogoBig/>}</div>
};

export default ServiceTypeIcon;