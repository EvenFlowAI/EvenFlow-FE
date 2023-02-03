import React, {useEffect, useState} from 'react';
import axios from "axios";
import {IFirstScreenOption} from "../../store/reducers/serviceTypes/types";
import {Loading} from "../UI/Loading";
import {makeStyles} from "@material-ui/core/styles";

type TServiceTypeIconProps = {card: IFirstScreenOption, onClick: () => void, isSM: boolean}

const useStyles = makeStyles((theme) => ({
    icon: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    noLogo: {
        width: '100%',
        padding: '37px 54px',
        color: "#DCDCDC",
        fontWeight: 'bold',
        fontSize: 32,
        backgroundColor: "#F4F4F4",
        [theme.breakpoints.down("sm")]: {
            fontSize: 20,
            padding: 30,
        }
    }
}))

const ServiceTypeIcon: React.FC<TServiceTypeIconProps> = ({card, onClick, isSM}) => {
    const [isIconLoading, setIsIconLoading] = useState<boolean>(false);
    const [icon, setIcon] = useState<string>('');
    const classes = useStyles();

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
            ? <div className={classes.icon} dangerouslySetInnerHTML={{__html: icon}} onClick={() => isSM && onClick()}/>
            : <div className={classes.noLogo}>No logo</div>
};

export default ServiceTypeIcon;